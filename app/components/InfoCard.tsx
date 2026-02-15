import PersonIcon from "@mui/icons-material/Person";
import LinkIcon from "@mui/icons-material/Link";
import BookIcon from "@mui/icons-material/Book";
import InfoIcon from "@mui/icons-material/Info";
import { Card, CardContent, Typography, SvgIconProps } from "@mui/material";
import {
  ConnectionResponse,
  UserResponse,
  ReferralResponse,
} from "../models/ResponseModels";

type CardMode = "person" | "connection" | "referral";

interface InfoCardProps {
  title: string;
  description: string;
  mode: CardMode;
  data: UserResponse | ConnectionResponse | ReferralResponse;
  onClick?: () => void;
}

function InfoCard({ data, title, description, mode, onClick }: InfoCardProps) {
  const renderIcon = () => {
    const iconProps: SvgIconProps = { sx: { fontSize: 40, mb: 2 } };

    switch (mode) {
      case "person":
        return <PersonIcon {...iconProps} />;
      case "connection":
        return <LinkIcon {...iconProps} />;
      case "referral":
        return <BookIcon {...iconProps} />;
      default:
        return <InfoIcon {...iconProps} />;
    }
  };
  const keys = Object.keys(data);

  return (
    <Card onClick={onClick} sx={{ cursor: onClick ? "pointer" : "default" }}>
      <CardContent>
        {renderIcon()}
        <Typography variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {data.id ? `ID: ${data.id}` : "No ID available"}
        </Typography>
        {keys.map((key) => (
          <Typography key={key} variant="body2" color="text.secondary">
            {`${key.replace(/_/g, " ")}: ${String(data[key as keyof typeof data] ?? "N/A")}`}
          </Typography>
        ))}
      </CardContent>
    </Card>
  );
}

export default InfoCard;
