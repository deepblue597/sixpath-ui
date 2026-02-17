import {
  Box,
  Card,
  CardContent,
  InputAdornment,
  List,
  Pagination,
  TextField,
  Typography,
} from "@mui/material";
import { UserBase } from "../../models/InputModels";
import { UserResponse } from "../../models/ResponseModels";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

interface PeopleListProps {
  people: UserResponse[];
  onClick?: (person: UserResponse) => void;
}

export default function PeopleList({ people, onClick }: PeopleListProps) {
  const [search, setSearch] = useState("");

  const filteredPeople = people.filter((person) =>
    `${person.first_name} ${person.last_name} ${person.company}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 4,
        }}>
        <TextField
          placeholder="Search people..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            width: {
              xs: "90%",
              sm: "70%",
              md: "50%",
            },
            "& .MuiOutlinedInput-root": {
              borderRadius: "50px", // makes it pill-shaped
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 3,
          p: 3,
        }}>
        {filteredPeople.map((person) => (
          <Card
            key={person.id}
            onClick={() => onClick?.(person)}
            sx={{
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                transform: "translateY(-6px)",
                boxShadow: 6,
              },
              borderRadius: 3,
            }}>
            <CardContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography variant="h6">
                  {person.first_name} {person.last_name}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {person.company}
                </Typography>

                <Typography variant="body2" color="primary">
                  {person.email}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination
          //   count={Math.ceil(total / rowsPerPage)}
          //   page={page + 1}
          //   onChange={(e, value) => setPage(value - 1)}
          color="primary"
        />
      </Box>
    </Box>
  );
}
