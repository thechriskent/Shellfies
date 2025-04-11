import { DisplayMode } from "@microsoft/sp-core-library";
import { SPFI } from "@pnp/sp";

export interface IShellfiesProps {
  title: string;
  hasTeamsContext: boolean;
  displayMode: DisplayMode;
  updateTitle: (newTitle: string) => void;
  sp: SPFI;
  listId?: string;
  columnName?: string;
  limit: number;
}
