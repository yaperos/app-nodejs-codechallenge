import { render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { HeaderText } from "../../components/atomos";

describe("<HeaderText />", () => {
  let component: RenderResult;
  beforeEach(() => {
    component = render(<HeaderText label="header text" />);
  });
  test("Renders label text correctly", async () => {
    expect(component.container).toHaveTextContent("header text");
    expect(component.container).toBeInTheDocument();
  });
});
