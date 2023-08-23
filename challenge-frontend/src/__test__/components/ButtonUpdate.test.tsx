import { render, RenderResult, prettyDOM } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { ButtonUpdate } from "../../components/atomos";

describe("<ButtonUpdate />", () => {
  let component: RenderResult;
  beforeEach(() => {
    component = render(
      <ButtonUpdate
        isLoading={false}
        updatePermission={() => {}}
        label="my button"
      />
    );
  });
  test("Renders label text correctly", async () => {
    expect(component.container).toHaveTextContent("my button");
    expect(component.container).toBeInTheDocument();
  });

  test("Renders label text correctly is loading false", async () => {
    component = render(
      <ButtonUpdate isLoading={true} updatePermission={() => {}} label="" />
    );
    const circleLoading = component.container.querySelector("circle");
    expect(component.container).toHaveTextContent("Procesando . .");
    expect(circleLoading).toBeInTheDocument();
    expect(component.container).toBeInTheDocument();
  });
});
