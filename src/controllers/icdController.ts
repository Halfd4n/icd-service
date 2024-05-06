import { Request, Response } from 'express';
import {
  fetchIcdFoundationData,
  fetchIcdMMSDataBySearchText,
  fetchEnrichedIcdData,
  fetchEntityByDiagnosis,
} from '../services/icdService';

export const getIcdFoundationInfo = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const data = await fetchIcdFoundationData(id);
    res.status(200).send(data);
  } catch (err) {
    console.error('Error fetching ICD data: ', err);
    res.status(500).send(`Server error: ${err}`);
  }
};

export const getIcdBySearchText = async (req: Request, res: Response) => {
  const { searchQuery } = req.params;

  try {
    const data = await fetchIcdMMSDataBySearchText(searchQuery);
    res.status(200).send(data);
  } catch (err) {
    console.error('Error fetching ICD data: ', err);
    res.status(500).send(`Server error: ${err}`);
  }
};

export const getEnrichedIcdData = async (req: Request, res: Response) => {
  const { icdCodes } = req.params;

  try {
    const data = await fetchEnrichedIcdData(icdCodes);
    res.status(200).send(data);
  } catch (err) {
    console.error('Error fetching ICD data: ', err);
    res.status(500).send(`Server error: ${err}`);
  }
};

export const getEntityByDiagnosis = async (req: Request, res: Response) => {
  const { searchText } = req.query;

  if (searchText)
    try {
      const data = await fetchEntityByDiagnosis(searchText.toString());
      res.status(200).send(data);
    } catch (err) {
      console.error('Error fetching ICD data: ', err);
      res.status(500).send(`Server error: ${err}`);
    }
};
