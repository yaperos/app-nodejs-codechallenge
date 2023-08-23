import { Typography } from "@mui/material";
import React from "react";
import { CustomColors } from "../../constants/Colors";

type BodyTextProps = {
  label: string | number;
  color?: string;
  fontFamily?: string;
};
const BodyText: React.FC<BodyTextProps> = ({ label, color, fontFamily }) => {
  return (
    <Typography fontFamily={fontFamily} variant="caption" color={color}>
      {label}
    </Typography>
  );
};

BodyText.defaultProps = {
  label: "Mi Nombre",
  color: CustomColors.black,
  fontFamily: "Montserrat-Medium",
};

export default BodyText;
