import { Card, Grid, TextField, Typography, Button, Box } from "@mui/material";
import { UserUpdate, UserCreate, AccountCreate } from "../models/InputModels";
import { useState, useMemo } from "react";

type FormMode = "create" | "update" | "createAccount";

// Pure functions for form configuration
const getFieldsForMode = (mode: FormMode): string[] => {
  const baseFields = [
    "first_name",
    "last_name",
    "company",
    "sector",
    "email",
    "phone",
    "linkedin_url",
    "how_i_know_them",
    "when_i_met_them",
    "notes",
  ];

  switch (mode) {
    case "createAccount":
      return [
        "first_name",
        "last_name",
        "username",
        "email",
        "password",
        "company",
        "sector",
        "phone",
        "linkedin_url",
        "how_i_know_them",
        "when_i_met_them",
        "notes",
      ];
    default:
      return baseFields;
  }
};

const getRequiredFieldsForMode = (mode: FormMode): string[] => {
  switch (mode) {
    case "create":
      return ["first_name", "last_name"];
    case "createAccount":
      return ["first_name", "last_name", "username", "password", "email"];
    case "update":
      return [];
    default:
      return [];
  }
};

const getDefaultFormDataForMode = (mode: FormMode): Record<string, any> => {
  const baseData: Record<string, string> = {
    first_name: "",
    last_name: "",
    company: "",
    sector: "",
    email: "",
    phone: "",
    linkedin_url: "",
    how_i_know_them: "",
    when_i_met_them: "",
    notes: "",
  };

  if (mode === "createAccount") {
    return {
      ...baseData,
      username: "",
      password: "",
      is_me: true,
    };
  }

  return baseData;
};

const getTitleForMode = (mode: FormMode): string => {
  switch (mode) {
    case "create":
      return "Create New Contact";
    case "update":
      return "Edit User Information";
    case "createAccount":
      return "Create Your Account";
    default:
      return "User Form";
  }
};

const getSubmitButtonTextForMode = (mode: FormMode): string => {
  switch (mode) {
    case "create":
      return "Create User";
    case "update":
      return "Update User";
    case "createAccount":
      return "Create Account";
    default:
      return "Submit";
  }
};

type FormData = UserUpdate | UserCreate | AccountCreate;

interface FormProps {
  mode: FormMode;
  initialData?: Partial<FormData>;
  onSubmit: (data: FormData) => void;
  onCancel?: () => void;
}

function Form({ mode, initialData, onSubmit, onCancel }: FormProps) {
  // Memoized pure computations
  const fieldsToShow = useMemo(() => getFieldsForMode(mode), [mode]);
  const requiredFields = useMemo(() => getRequiredFieldsForMode(mode), [mode]);
  const defaultFormData = useMemo(
    () => getDefaultFormDataForMode(mode),
    [mode],
  );
  const title = useMemo(() => getTitleForMode(mode), [mode]);
  const submitButtonText = useMemo(
    () => getSubmitButtonTextForMode(mode),
    [mode],
  );

  // Pure initial state calculation
  const initialFormState = useMemo(
    () => ({
      ...defaultFormData,
      ...initialData,
    }),
    [defaultFormData, initialData],
  );

  const [form, setForm] = useState<Record<string, any>>(initialFormState);

  // Pure function for handling input changes
  const handleInputChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Pure function for handling form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form as FormData);
  };

  return (
    <Card
      elevation={8}
      sx={{
        width: "40%",
        padding: 4,
        alignContent: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}>
      <Typography variant="h3" gutterBottom color="primary">
        {title}
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid
          container
          spacing={2}
          sx={{
            justifyContent: "center",
          }}>
          {fieldsToShow.map((key) => {
            const value = form[key];
            const isRequired = requiredFields.includes(key);

            return (
              <Grid key={key} size={5}>
                <TextField
                  fullWidth
                  required={isRequired}
                  id={key}
                  name={key}
                  label={key
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                  type={
                    key === "password"
                      ? "password"
                      : key === "email"
                        ? "email"
                        : "text"
                  }
                  value={value || ""}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  variant="outlined"
                  margin="normal"
                  helperText={isRequired ? "Required field" : ""}
                />
              </Grid>
            );
          })}
        </Grid>

        <Box sx={{ mt: 3, display: "flex", gap: 2, justifyContent: "center" }}>
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            size="large">
            {submitButtonText}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              size="large"
              onClick={onCancel}>
              Cancel
            </Button>
          )}
        </Box>
      </form>
    </Card>
  );
}

export default Form;
