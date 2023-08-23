import { render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { HeaderLeftSegments } from "../../components/moleculas";

describe("<HeaderLeftSegment />", () => {
  let component: RenderResult;
  const labels = ["test1", "test2"];
  beforeEach(() => {
    component = render(<HeaderLeftSegments labels={labels} borderBottom />);
  });
  test("Renders label text correctly", async () => {
    const labelsText = component.container.querySelectorAll("span");
    const icons = component.container.querySelectorAll("svg");
    expect(labelsText.length).toEqual(2);
    expect(icons.length).toEqual(2);
    expect(labelsText[0]).toHaveTextContent("test1");
    expect(labelsText[1]).toHaveTextContent("test2");
    expect(component.container).toBeInTheDocument();
  });
});
