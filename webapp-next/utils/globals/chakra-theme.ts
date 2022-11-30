import ButtonTheme from "./components-theme/button-theme";
import TagTheme from "./components-theme/tag-theme";
import { TabsTheme } from "./components-theme/tabs-theme";
import InputTheme from "./components-theme/input-theme";

const theme_extend = {
  styles: {},
  colors: {
    primary: "#2F6CFF",
    secondary: "#E1006C",
    black: "#1B1D1F",
    neutral: "#FAFCFF",
    lightBlue: "#A2DDF1",
    lightPink: "#FF7E95",
  },

  components: {
    Button: ButtonTheme,
    Tag: TagTheme,
    Tabs: TabsTheme,
    Input: InputTheme,
  },
};

export default theme_extend;
