import React from "react";
import { ChecklistOutlined } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { CustomColors } from "../../constants/Colors";

type SegmentTextProps = {
  label?: string;
  borderBottom?: boolean;
};
const SegmentText: React.FC<SegmentTextProps> = ({ label, borderBottom }) => {
  return (
    <Box display="flex" alignItems="center" gap={1} position="relative">
      <ChecklistOutlined fontSize="small" />
      <Typography
        fontFamily={"Montserrat-Medium"}
        variant="caption"
        color={CustomColors["gray-1"]}
      >
        {label}
      </Typography>
      {borderBottom && (
        <Box
          sx={{
            background: CustomColors.black,
            width: "100px",
            height: "3px",
            position: "absolute",
            bottom: -10,
          }}
        />
      )}
    </Box>
  );
};

SegmentText.defaultProps = {
  label: "Show All",
  borderBottom: true,
};
export default SegmentText;
