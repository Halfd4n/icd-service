import https from 'https';
const ICD_CODE_REGEX = /\/+/g;
const ICD_FOUNDATION_ID_REGEX = /\/(\d+)(?:\/(\d+|[^\/]+))?$/;

interface IcdFoundationResponse {
  icdCode: string;
  stemId: string;
}

interface EnrichedIcdResponse {
  icdCode: string;
  foundationId: string | null;
  title: string | null;
  definition: string | null;
  isError: boolean;
  error: DetailedError | null;
}

interface DetailedError {
  type: string;
  message: string;
  details?: any;
}

export const fetchIcdFoundationData = async (id: string, authToken: string) => {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: 'application/json',
        'Accept-Language': 'en',
        'API-Version': process.env.API_VERSION,
      },
    };

    https
      .get(`${process.env.API_URL}/entity/${id}`, options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          if (res.statusCode === 200) {
            try {
              const jsonData = JSON.parse(data);
              resolve(jsonData);
            } catch (err) {
              console.error('Failed to parse JSON:', err);
              reject(new Error('Failed to parse JSON.'));
            }
          } else {
            console.error('API request failed with status:', res.statusCode);
            reject(
              new Error(
                `API request failed with status: ${res.statusCode} and body: ${data}`
              )
            );
          }
        });
      })
      .on('error', (e) => {
        console.error('HTTP request failed:', e);
        reject(e);
      });
  });
};

export const fetchIcdMMSDataBySearchText = async (
  searchText: string,
  authToken: string
) => {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: 'application/json',
        'Accept-Language': 'en',
        'API-Version': process.env.API_VERSION,
      },
    };

    https
      .get(
        `${process.env.API_URL}/release/${process.env.ICD_VERSION}/${process.env.ICD_RELEASE_ID}/${process.env.ICD_LINEARIZATION_NAME}/search?q=${searchText}&subtreeFilterUsesFoundationDescendants=false&includeKeywordResult=false&useFlexisearch=false&flatResults=false&highlightingEnabled=false&medicalCodingMode=true`,
        options,
        (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            try {
              resolve(JSON.parse(data));
            } catch (err) {
              reject(err);
            }
          });
        }
      )
      .on('error', (e) => reject(e));
  });
};

export const fetchEnrichedIcdData = async (
  icdCodes: string,
  authToken: string
) => {
  const icdCodesArray = icdCodes.split(ICD_CODE_REGEX);

  try {
    const icdCodesAndStemIds = await Promise.all(
      icdCodesArray.map(async (icdCode) => {
        try {
          const res = await fetchIcdFoundationUri(icdCode, authToken);
          return { icdCode, stemId: res.stemId, isError: false, error: null };
        } catch (error) {
          console.error(`Error fetching foundation URI for ${icdCode}:`, error);
          return {
            icdCode,
            stemId: null,
            isError: true,
            error: {
              type: 'fetch-foundation-error',
              message: `Failed to fetch foundation stem id for ICD: ${icdCode}`,
              details: error instanceof Error ? error.message : error,
            },
          };
        }
      })
    );

    const icdCodesAndFoundationIds = icdCodesAndStemIds.map(
      ({ icdCode, stemId, isError, error }) => {
        if (isError) return { icdCode, foundationId: null, isError, error };
        return extractFoundationId(icdCode, stemId);
      }
    );

    const enrichmentPromises = icdCodesAndFoundationIds.map(
      async ({ icdCode, foundationId, isError, error }) => {
        if (isError)
          return {
            icdCode,
            foundationId,
            title: null,
            definition: null,
            isError,
            error,
          };

        try {
          const res = await fetchEnrichmentData(foundationId!, authToken);
          return {
            icdCode,
            foundationId,
            title: res.title,
            definition: res.definition,
            isError: false,
            error: null,
          };
        } catch (error) {
          console.error(
            `Error fetching enrichment data for ${icdCode}:`,
            error
          );
          return {
            icdCode,
            foundationId,
            title: null,
            definition: null,
            isError: true,
            error: {
              type: 'fetch-enrichment-error',
              message: `Failed to fetch enrichment data for foundation ID: ${foundationId}`,
              details: error instanceof Error ? error.message : error,
            },
          };
        }
      }
    );

    const enrichedIcdResponse = await Promise.all(enrichmentPromises);

    return enrichedIcdResponse;
  } catch (err) {
    console.error('Error fetching ICD data: ', err);
    return [];
  }
};

const fetchIcdFoundationUri = async (
  icdCode: string,
  authToken: string
): Promise<IcdFoundationResponse> => {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: 'application/json',
        'Accept-Language': 'en',
        'API-Version': process.env.API_VERSION,
      },
    };

    https
      .get(
        `${process.env.API_URL}/release/${process.env.ICD_VERSION}/${process.env.ICD_RELEASE_ID}/${process.env.ICD_LINEARIZATION_NAME}/codeinfo/${icdCode}`,
        options,
        (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            try {
              resolve(JSON.parse(data));
            } catch (err) {
              reject(err);
            }
          });
        }
      )
      .on('error', (e) => reject(e));
  });
};

const fetchEnrichmentData = async (
  foundationId: string,
  authToken: string
): Promise<EnrichedIcdResponse> => {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: 'application/json',
        'Accept-Language': 'en',
        'API-Version': process.env.API_VERSION,
      },
    };

    https
      .get(`${process.env.API_URL}/entity/${foundationId}`, options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (err) {
            reject(err);
          }
        });
      })
      .on('error', (e) => reject(e));
  });
};

export const fetchEntityByDiagnosis = async (
  searchText: string,
  authToken: string
) => {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: 'application/json',
        'Accept-Language': 'en',
        'API-Version': process.env.API_VERSION,
      },
    };

    https
      .get(
        `${process.env.API_URL}/release/${process.env.ICD_VERSION}/${process.env.ICD_RELEASE_ID}/${process.env.ICD_LINEARIZATION_NAME}/autocode?searchText=${searchText}`,
        options,
        (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            if (res.statusCode === 200) {
              try {
                const jsonData = JSON.parse(data);
                resolve(jsonData);
              } catch (err) {
                console.error('Failed to parse JSON:', err);
                reject(new Error('Failed to parse JSON.'));
              }
            } else {
              console.error('API request failed with status:', res.statusCode);
              reject(
                new Error(
                  `API request failed with status: ${res.statusCode} and body: ${data}.`
                )
              );
            }
          });
        }
      )
      .on('error', (e) => {
        console.error('HTTP request failed:', e);
        reject(e);
      });
  });
};

/**
 * Extracts the ID from a URI, which can be placed as the last or next-to-last segment of the URI.
 * @param {string} stemId - The URI from which the ID is extracted.
 * @returns {{ icdCode: string, foundationId: string | null }} - Object containing the code and the extracted ID.
 */
const extractFoundationId = (icdCode: string, stemId: string | null) => {
  if (!hasFoundationId(stemId)) {
    return {
      icdCode,
      foundationId: null,
      isError: true,
      error: {
        type: 'extract-foundation-id-error',
        message: `Failed to extract stem id for ICD: ${icdCode}`,
        details: null,
      },
    };
  }

  const match = stemId!.match(ICD_FOUNDATION_ID_REGEX);

  if (match !== null) {
    const foundationId =
      match[2] && /^\d+$/.test(match[2]) ? match[2] : match[1];
    return { icdCode, foundationId, isError: false, error: null };
  }

  return {
    icdCode,
    foundationId: null,
    isError: false,
    error: {
      type: 'match-foundation-id-error',
      message: `Failed to match foundation id for ICD: ${icdCode}`,
      details: null,
    },
  };
};

function hasFoundationId(foundationId: any): foundationId is string {
  return typeof foundationId === 'string';
}
