import { Box, Divider, IconButton, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { CustomColors } from "../../constants/Colors";
import { ArrowRightAltRounded, AddCircleOutline } from "@mui/icons-material";
import { HeaderLeftSegments, HeaderRightText } from "../moleculas";

type HeaderComponentProps = {
  labelsLeft?: string[];
  labelsRight?: string[];
  titleName?: string;
};
const HeaderComponent: React.FC<HeaderComponentProps> = ({
  labelsLeft = [],
  labelsRight = [],
  titleName,
}) => {
  return (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap={1}
      >
        <HeaderLeftSegments labels={labelsLeft} borderBottom={true} />
        <HeaderRightText labels={labelsRight} />
      </Box>
      <Box paddingY={1}>
        <Divider />
      </Box>
      <Box display="flex" alignItems="center" gap={1}>
        <ArrowRightAltRounded />
        <Typography
          fontFamily={"Montserrat-Bold"}
          fontWeight={600}
          color={CustomColors.black}
        >
          {titleName}
        </Typography>
        <Link to={`/create`}>
          <IconButton>
            <AddCircleOutline />
          </IconButton>
        </Link>
        {/* <TextField
        fullWidth
        label={
          <Typography
            variant="caption"
            fontFamily={"Montserrat-Medium"}
            color={CustomColors.lightBlack}
          >
            Busqueda. .
          </Typography>
        }
        variant="standard"
        type="search"
        size="small"
      /> */}
      </Box>
    </Box>
  );
};

HeaderComponent.defaultProps = {
  labelsLeft: ["Show All"],
  labelsRight: ["Filter", "Sort"],
  titleName: "Transaction",
};
export default HeaderComponent;
