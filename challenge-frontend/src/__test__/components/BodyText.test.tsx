import { render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { BodyText } from "../../components/atomos";

describe("<BodyText />", () => {
  let component: RenderResult;

  beforeEach(() => {
    component = render(<BodyText label="test body text" />);
  });
  test("Renders label text correctly", async () => {
    expect(component.container).toHaveTextContent("test body text");
    expect(component.container).toBeInTheDocument();
  });
});
