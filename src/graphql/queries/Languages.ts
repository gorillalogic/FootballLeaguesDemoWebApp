import gql from 'graphql-tag';
import { Language } from '../generated/types';

const LANGUAGES_QUERY = gql`
  query languages {
    languages {
      _id
      name
      languageId
    }
  }
`;

type LanguagesQueryDataType = {
  languages: Language[]
};

export type LanguagesQueryData = LanguagesQueryDataType;

/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

export {
  LANGUAGES_QUERY
};