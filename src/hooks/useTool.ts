import { searchParams } from "@/lib/tool-params";
import {
  ArrowUpDown,
  Combine,
  Image,
  Pencil,
  Scissors,
  Type,
} from "lucide-react";
import { useQueryState } from "nuqs";
import DrawTool from "@/components/tools/DrawTool";
import EditTool from "@/components/tools/EditTool";
import SplitTool from "@/components/tools/SplitTool";
import MergeTool from "@/components/tools/MergeTool";
import ArrangeTool from "@/components/tools/ArrangeTool";
import PdfToImageTool from "@/components/tools/PdfToImageTool";

const tools = [
  { id: "draw", label: "Draw", icon: Pencil },
  { id: "edit", label: "Edit", icon: Type },
  { id: "split", label: "Split", icon: Scissors },
  { id: "merge", label: "Merge", icon: Combine },
  { id: "arrange", label: "Arrange", icon: ArrowUpDown },
  { id: "to-image", label: "To Image", icon: Image },
] as const;

export type ToolId = (typeof tools)[number]["id"];
const toolComponents: Record<ToolId, React.FC> = {
  draw: DrawTool,
  edit: EditTool,
  split: SplitTool,
  merge: MergeTool,
  arrange: ArrangeTool,
  "to-image": PdfToImageTool,
};
const useTool = () => {
  const [activeTool, setActiveTool] = useQueryState(
    "tool",
    searchParams.tool
      .withOptions({ shallow: true, throttleMs: 1000 })
      .withDefault("draw"),
  );
  const ActiveComponent = toolComponents[activeTool as ToolId];
  return {
    activeTool,
    setActiveTool,
    tools,
    ActiveComponent,
  };
};

export default useTool;
