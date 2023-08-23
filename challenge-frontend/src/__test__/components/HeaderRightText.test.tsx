import { render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { HeaderRightText } from "../../components/moleculas";

describe("<HeaderRightSegment />", () => {
  let component: RenderResult;
  const labels = ["test1", "test2"];
  beforeEach(() => {
    component = render(<HeaderRightText labels={labels} />);
  });
  test("Renders label text correctly", async () => {
    const labelsText = component.container.querySelectorAll("span");
    const icon = component.container.querySelector("svg");
    expect(labelsText[0]).toHaveTextContent("test1");
    expect(labelsText[1]).toHaveTextContent("test2");
    expect(icon).toBeInTheDocument();
    expect(component.container).toBeInTheDocument();
  });
});
