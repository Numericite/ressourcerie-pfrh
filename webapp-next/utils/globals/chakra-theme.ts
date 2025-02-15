import ButtonTheme from './components-theme/button-theme';
import RadioTheme from './components-theme/radio-theme';
import TagTheme from './components-theme/tag-theme';
import { TabsTheme } from './components-theme/tabs-theme';
import InputTheme from './components-theme/input-theme';
import CardTheme from './components-theme/card-theme';
import SelectTheme from './components-theme/select-theme';
import { StepsTheme as Steps } from 'chakra-ui-steps';

const theme_extend = {
  styles: {},
  fonts: {
    heading: `Poppins`,
    body: `Poppins`
  },
  colors: {
    primary: '#78D8C7',
    secondary: '#2f6cff',
    black: '#1B1D1F',
    neutral: '#FAFCFF',
    neutralLightBlue: '#E9F1FF',
    neutralDark: '#6B829B',
    neutralLight: '#627992',
    neutralText: '#6B829B',
    neutralBlue: '#204064',
    lightBlue: '#A2DDF1',
    lightPink: '#FF7E95'
  },
  fontSizes: {
    '1.5xl': '1.375rem',
    '2.5xl': '1.75rem',
    '5.5xl': '3.5rem',
    '7.5xl': '5.5rem'
  },
  sizes: {
    space: {
      4.5: '1.125rem',
      11: '2.75rem'
    },
    container: {
      '2lg': '1124px'
    }
  },

  components: {
    Button: ButtonTheme,
    Radio: RadioTheme,
    Tag: TagTheme,
    Tabs: TabsTheme,
    Input: InputTheme,
    Card: CardTheme,
    Select: SelectTheme,
    Steps: Steps
  }
};

export default theme_extend;
