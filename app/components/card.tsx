import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Icon,
  List,
  Typography,
} from "@mui/material";
import { Dict } from "styled-components/dist/types";
import LocationPinIcon from "@mui/icons-material/LocationPin";
import Link from "next/link";
interface Image {
  src: string;
  alt: string;
}
import ListItem from "@mui/material/ListItem";

interface TravelCardProps {
  id: number;
  title: string;
  img: Image;
  country: string;
  googleMapLink: string;
  dates: string;
  text: string;
}

interface TravelCardComponentProps {
  travelData: TravelCardProps[];
  onClick?: (card: TravelCardProps) => void;
}

export default function TravelCard({
  travelData,
  onClick,
}: TravelCardComponentProps) {
  return (
    <List
      sx={{
        display: "flex",
        flexDirection: "column",
      }}>
      {travelData.map((card: TravelCardProps) => (
        <ListItem
          key={card.id}
          sx={{ width: "auto", margin: 1, justifyContent: "center" }}>
          <Card
            key={card.id}
            sx={{
              display: "flex",

              height: 400,
              width: "90%",
              cursor: onClick ? "pointer" : "default",
              "&:hover": onClick
                ? {
                    boxShadow: 6,
                    transform: "translateY(-2px)",
                  }
                : {},
            }}
            onClick={() => onClick?.(card)}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}>
              <CardMedia
                sx={{
                  height: "90%",
                  maxWidth: 600,
                  margin: 2,
                  borderRadius: 2,
                }}
                component="img"
                image={card.img.src}
                alt={card.img.alt}
              />
            </Box>
            <CardContent
              sx={{
                flex: "1 0 auto",
                maxWidth: "60%",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}>
              <Typography variant="subtitle1" color="text.secondary">
                <LocationPinIcon /> {card.country} |{" "}
                <Link href={card.googleMapLink}>View on Google Maps</Link>
              </Typography>
              <Typography component="div" variant="h4">
                {card.title}
              </Typography>
              <Typography
                variant="subtitle1"
                component="div"
                sx={{ color: "text.secondary", fontWeight: "bold" }}>
                {card.dates}
              </Typography>

              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {card.text}
              </Typography>
            </CardContent>
          </Card>
        </ListItem>
      ))}
    </List>
  );
}
