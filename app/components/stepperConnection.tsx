import React from "react";
import { ConnectionCreate } from "../models/InputModels";
import {
  Box,
  Button,
  Step,
  StepLabel,
  Stepper,
  TextField,
  MenuItem,
} from "@mui/material";
import NumberField from "./NumberField";

interface StepperConnectionProps {
  onSubmit: (data: ConnectionCreate) => void;
  onCancel?: () => void;
}
export default function StepperConnection({
  onSubmit,
  onCancel,
}: StepperConnectionProps) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [formData, setFormData] = React.useState<ConnectionCreate>({
    person1_id: 0,
    person2_id: 0,
    relationship: "",
    strength: 0,
    context: "",
    last_interaction: "",
    notes: "",
  });

  const steps = ["Select People", "Define Relationship", "Add Details"];

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // Final step, submit the form
      onSubmit(formData);
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleChange =
    (field: keyof ConnectionCreate) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({
        ...formData,
        [field]: event.target.value,
      });
    };

  const handleNumberChange =
    (field: keyof ConnectionCreate) => (value: number | null) => {
      setFormData({
        ...formData,
        [field]: value ?? 0,
      });
    };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
            <NumberField
              label="Person 1 ID"
              min={0}
              value={formData.person1_id}
              onValueChange={handleNumberChange("person1_id")}
              required
            />
            <NumberField
              label="Person 2 ID"
              min={0}
              value={formData.person2_id}
              onValueChange={handleNumberChange("person2_id")}
              required
            />
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Relationship"
              value={formData.relationship}
              onChange={handleChange("relationship")}
              fullWidth
              required
              placeholder="e.g., Friend, Colleague, Family"
            />
            <NumberField
              label="Strength"
              min={0}
              max={5}
              value={formData.strength}
              onValueChange={handleNumberChange("strength")}
              required
            />
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Context"
              value={formData.context}
              onChange={handleChange("context")}
              fullWidth
              multiline
              rows={2}
              placeholder="How did they meet? What's the context?"
            />
            <TextField
              label="Last Interaction"
              type="date"
              value={formData.last_interaction}
              onChange={handleChange("last_interaction")}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Notes"
              value={formData.notes}
              onChange={handleChange("notes")}
              fullWidth
              multiline
              rows={3}
              placeholder="Additional notes about this connection"
            />
          </Box>
        );
      default:
        return "Unknown step";
    }
  };

  //   const handleReset = () => {
  //     setActiveStep(0);
  //   };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 600,
        mx: "auto",
        mt: 5,
        p: 3,
        border: "1px solid #ccc",
        borderRadius: 2,
      }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Render form fields based on activeStep */}
      {renderStepContent(activeStep)}

      {/* Add navigation buttons */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        {activeStep > 0 && (
          <Button
            onClick={() => setActiveStep((prev) => prev - 1)}
            sx={{ mr: 1 }}>
            Back
          </Button>
        )}
        <Button variant="contained" onClick={handleNext}>
          {activeStep === steps.length - 1 ? "Finish" : "Next"}
        </Button>
      </Box>
      {formData && (
        <Box sx={{ mt: 4 }}>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </Box>
      )}
    </Box>
  );
}
