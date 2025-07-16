import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

interface FilterField {
  name: string;
  label: string;
}

interface ShowAppliedFiltersProps {
  allFilters: FilterField[];
  activeFilters: string[];
  setActiveFilters: (filters: string[]) => void;
  open: boolean;
  onClose: () => void;
}

const ShowAppliedFilters: React.FC<ShowAppliedFiltersProps> = ({
  allFilters,
  activeFilters,
  setActiveFilters,
  open,
  onClose,
}) => {
  // Local state to stage changes before applying
  const [stagedFilters, setStagedFilters] =
    React.useState<string[]>(activeFilters);

  React.useEffect(() => {
    setStagedFilters(activeFilters);
  }, [activeFilters, open]);

  const handleAdd = (name: string) => {
    if (!stagedFilters.includes(name)) {
      setStagedFilters([...stagedFilters, name]);
    }
  };
  const handleRemove = (name: string) => {
    setStagedFilters(stagedFilters.filter((n) => n !== name));
  };
  const handleApply = () => {
    setActiveFilters(stagedFilters);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Show Applied Filters</DialogTitle>
      <DialogContent>
        <div className="flex flex-col gap-2 mt-2">
          {allFilters.map((f) => (
            <div
              key={f.name}
              className="flex items-center justify-between py-1 border-b last:border-b-0"
            >
              <div style={{ marginBottom: 8 }}>
                <div
                  style={{
                    fontSize: 13,
                    color: "#555",
                    fontWeight: 500,
                    marginBottom: 4,
                  }}
                >
                  {f.label}
                </div>
                <TextField
                  fullWidth
                  size="small"
                  placeholder=""
                  value={stagedFilters.includes(f.name) ? f.name : ""}
                  onChange={(e) => handleAdd(e.target.value)}
                />
              </div>
              {stagedFilters.includes(f.name) ? (
                <Button
                  size="small"
                  color="error"
                  variant="outlined"
                  onClick={() => handleRemove(f.name)}
                >
                  -
                </Button>
              ) : (
                <Button
                  size="small"
                  color="primary"
                  variant="outlined"
                  onClick={() => handleAdd(f.name)}
                >
                  +
                </Button>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleApply} variant="contained">
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShowAppliedFilters;
