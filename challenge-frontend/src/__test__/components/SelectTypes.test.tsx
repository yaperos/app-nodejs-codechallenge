import { render, RenderResult, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { SelectTypes } from "../../components/atomos";
import { IPermissionTypes } from "../../types/permissionTypes/PermissionTypes";

describe("<SelectTypes />", () => {
  let component: RenderResult;
  const typesPermission: IPermissionTypes[] = [
    { id: 1, description: "admin" },
    { id: 2, description: "user" },
  ];
  beforeEach(() => {
    component = render(
      <SelectTypes
        typePermit={0}
        typesPermission={typesPermission}
        setTypePermit={() => {}}
      />
    );
  });
  test("Renders label selects correctly", async () => {
    const selectPermission = component.container.querySelector("select");
    const selectOptionsPermission = component.getAllByRole("option");
    expect(selectOptionsPermission).toHaveLength(++typesPermission.length);
    expect(selectPermission).toHaveValue("0");
    expect(component.container).toBeInTheDocument();
  });

  test("Handler change select correctly", async () => {
    const mockSetTypesPermission = jest.fn();
    component = render(
      <SelectTypes
        typePermit={0}
        typesPermission={typesPermission}
        setTypePermit={mockSetTypesPermission}
      />
    );
    const selectPermission = component.container.querySelector("select");
    if (selectPermission) {
      fireEvent.change(selectPermission, { target: { value: 1 } });
      expect(selectPermission).toHaveValue("1");
      expect(mockSetTypesPermission).toHaveBeenCalledWith(1);
    }

    expect(component.container).toBeInTheDocument();
  });
});
