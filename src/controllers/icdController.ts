import { Request, Response } from 'express';
import {
  fetchIcdFoundationData,
  fetchIcdMMSDataBySearchText,
  fetchEnrichedIcdData,
  fetchEntityByDiagnosis,
} from '../services/icdService';

export const getIcdFoundationInfo = async (req: Request, res: Response) => {
  const { id } = req.params;
  const authToken = req.headers.authorization?.split(' ')[1];

  try {
    const data = await fetchIcdFoundationData(id, authToken!);
    res.status(200).send(data);
  } catch (err) {
    console.error('Error fetching ICD data: ', err);
    res.status(500).send(`Server error: ${err}`);
  }
};

export const getIcdBySearchText = async (req: Request, res: Response) => {
  const { searchQuery } = req.params;
  const authToken = req.headers.authorization?.split(' ')[1];

  try {
    const data = await fetchIcdMMSDataBySearchText(searchQuery, authToken!);
    res.status(200).send(data);
  } catch (err) {
    console.error('Error fetching ICD data: ', err);
    res.status(500).send(`Server error: ${err}`);
  }
};

export const getEnrichedIcdData = async (req: Request, res: Response) => {
  const { icdCodes } = req.params;
  const authToken = req.headers.authorization?.split(' ')[1];

  try {
    const data = await fetchEnrichedIcdData(icdCodes, authToken!);
    res.status(200).send(data);
  } catch (err) {
    console.error('Error fetching ICD data: ', err);
    res.status(500).send(`Server error: ${err}`);
  }
};

export const getEntityByDiagnosis = async (req: Request, res: Response) => {
  const { searchText } = req.query;
  const authToken = req.headers.authorization?.split(' ')[1];

  if (searchText)
    try {
      const data = await fetchEntityByDiagnosis(
        searchText.toString(),
        authToken!
      );
      res.status(200).send(data);
    } catch (err) {
      console.error('Error fetching ICD data: ', err);
      res.status(500).send(`Server error: ${err}`);
    }
};
