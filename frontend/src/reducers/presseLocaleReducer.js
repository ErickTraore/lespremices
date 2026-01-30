// File: frontend/src/reducers/presseLocaleReducer.js

import { 
  FETCH_PRESSE_LOCALE, 
  FILTER_PRESSE_LOCALE_BY_CITY 
} from '../actions/presseLocaleActions';

const initialState = {
  messages: [],
  filteredMessages: [],
  selectedCity: null, // 'lyon', 'paris', 'marseille', ou null pour tous
  loading: false,
  error: null
};

export default function presseLocaleReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_PRESSE_LOCALE:
      return {
        ...state,
        messages: action.payload || [],
        filteredMessages: action.payload || [],
        loading: false,
        error: null
      };

    case FILTER_PRESSE_LOCALE_BY_CITY:
      const city = action.payload;
      const filtered = city 
        ? state.messages.filter(msg => msg.presse === city)
        : state.messages;
      
      return {
        ...state,
        selectedCity: city,
        filteredMessages: filtered
      };

    default:
      return state;
  }
}
