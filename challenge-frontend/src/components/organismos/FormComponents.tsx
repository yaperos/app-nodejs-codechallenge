import { Grid, TextField, Typography } from "@mui/material";
import React from "react";
import { ButtonUpdate, HeaderText } from "../atomos";
import { CustomColors } from "../../constants/Colors";

type FormComponentsProps = {
  transactionExternalId: string;
  setTransactionExternalId: (value: string) => void;
  value: string;
  isLoading: boolean;
  isLoadingSearch: boolean;
  buttonLabel: string;
  setValue: (value: string) => void;
  handlerButtonForm: () => void;
  handlerButtonSearchForm: () => void;
};
const FormComponents: React.FC<FormComponentsProps> = ({
  transactionExternalId,
  setTransactionExternalId,
  value,
  isLoading,
  isLoadingSearch,
  buttonLabel,
  setValue,
  handlerButtonForm,
  handlerButtonSearchForm,
}) => {
  return (
    <Grid>
      <Grid
        paddingX={"10%"}
        container
        spacing={5}
        marginBottom={5}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            id="standard-basic"
            label={<HeaderText fontFamily="Montserrat-Regular" label="Value" />}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <ButtonUpdate
            isLoading={isLoading}
            updatePermission={handlerButtonForm}
            label={buttonLabel}
          />
        </Grid>
      </Grid>

      <Grid
        paddingX={"10%"}
        container
        spacing={5}
        marginBottom={5}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            id="standard-basic"
            label={
              <HeaderText
                fontFamily="Montserrat-Regular"
                label="transactionExternalId by search"
              />
            }
            value={transactionExternalId}
            onChange={(e) => setTransactionExternalId(e.target.value)}
            variant="standard"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <ButtonUpdate
            isLoading={isLoadingSearch}
            updatePermission={handlerButtonSearchForm}
            label={"Search transaction"}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default FormComponents;
