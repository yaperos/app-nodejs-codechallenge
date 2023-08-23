import { Typography } from "@mui/material";
import React from "react";
import { CustomColors } from "../../constants/Colors";

type HeaderTextProps = {
  label: string;
  color?: string;
  fontFamily?: string;
};
const HeaderText: React.FC<HeaderTextProps> = ({
  label,
  color,
  fontFamily,
}) => {
  return (
    <Typography fontFamily={fontFamily} variant="caption" color={color}>
      {label}
    </Typography>
  );
};

HeaderText.defaultProps = {
  label: "Filter",
  color: CustomColors["gray-3"],
  fontFamily: "Montserrat-Bold",
};

export default HeaderText;
