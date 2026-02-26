import {
  Box,
  Card,
  CardContent,
  InputAdornment,
  Pagination,
  TextField,
  Typography,
} from "@mui/material";
import { UserResponse } from "../../lib/types";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

interface PeopleListProps {
  people: UserResponse[];
  onClick?: (person: UserResponse) => void;
}

const ROWS_PER_PAGE = 9; // 3x3 grid fits nicely

export default function PeopleList({ people, onClick }: PeopleListProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filteredPeople = people.filter((person) =>
    `${person.first_name} ${person.last_name} ${person.company}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  // Slice the filtered results based on current page
  const paginatedPeople = filteredPeople.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE,
  );

  // Reset to page 1 when search changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <TextField
          placeholder="Search people..."
          value={search}
          onChange={handleSearchChange}
          sx={{
            width: { xs: "90%", sm: "70%", md: "50%" },
            "& .MuiOutlinedInput-root": {
              borderRadius: "50px",
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
        {paginatedPeople.map((person) => (
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
          count={Math.ceil(filteredPeople.length / ROWS_PER_PAGE)}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Box>
  );
}
