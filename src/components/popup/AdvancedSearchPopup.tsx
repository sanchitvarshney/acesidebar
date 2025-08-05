import React, { useState, useRef } from 'react';
import { 
  Popper, 
  Paper, 
  Box, 
  Typography, 
  IconButton, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Divider,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@mui/material';
import { 
  Close as CloseIcon, 
  Add as AddIcon,
  OpenInNew as OpenInNewIcon,
  Search as SearchIcon,
  Article as ArticleIcon,
  ContactSupport as ContactIcon,
  ConfirmationNumber as TicketIcon
} from '@mui/icons-material';

interface AdvancedSearchPopupProps {
  open: boolean;
  onClose: () => void;
  anchorEl: HTMLElement | null;
}

interface FilterRow {
  id: string;
  field: string;
  operator: string;
  value: string;
}

type SearchType = 'knowledgebase' | 'article' | 'contact' | 'ticket';

const AdvancedSearchPopup: React.FC<AdvancedSearchPopupProps> = ({ open, onClose, anchorEl }) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedSearchType, setSelectedSearchType] = useState<SearchType>('ticket');
  const [logicOperator, setLogicOperator] = useState('AND');
  const [filters, setFilters] = useState<FilterRow[]>([
    { id: '1', field: 'Title', operator: 'Contains', value: '' }
  ]);

  // Search type options with icons
  const searchTypes = [
    { value: 'knowledgebase', label: 'Knowledge Base', icon: <SearchIcon /> },
    { value: 'article', label: 'Articles', icon: <ArticleIcon /> },
    { value: 'contact', label: 'Contacts', icon: <ContactIcon /> },
    { value: 'ticket', label: 'Tickets', icon: <TicketIcon /> }
  ];

  // Field options for each search type
  const fieldOptionsMap = {
    knowledgebase: [
      'Title',
      'Content', 
      'Category',
      'Tags',
      'Author',
      'Created Date',
      'Updated Date',
      'Status',
      'All fields'
    ],
    article: [
      'Title',
      'Content',
      'Category',
      'Tags',
      'Author',
      'Published Date',
      'Status',
      'Views',
      'All fields'
    ],
    contact: [
      'Name',
      'Email',
      'Phone',
      'Company',
      'Department',
      'Created Date',
      'Last Contact',
      'Status',
      'All fields'
    ],
    ticket: [
      'Subject',
      'Description',
      'Status',
      'Priority',
      'Assignee',
      'Customer',
      'Created Date',
      'Updated Date',
      'Category',
      'All fields'
    ]
  };

  // Operator options for each field type
  const operatorOptions = {
    'Title': ['Contains', 'Does not contain', 'Starts with', 'Ends with', 'Is empty', 'Is not empty'],
    'Content': ['Contains', 'Does not contain', 'Starts with', 'Ends with', 'Is empty', 'Is not empty'],
    'Subject': ['Contains', 'Does not contain', 'Starts with', 'Ends with', 'Is empty', 'Is not empty'],
    'Description': ['Contains', 'Does not contain', 'Starts with', 'Ends with', 'Is empty', 'Is not empty'],
    'Name': ['Contains', 'Does not contain', 'Starts with', 'Ends with', 'Is empty', 'Is not empty'],
    'Email': ['Contains', 'Does not contain', 'Starts with', 'Ends with', 'Is empty', 'Is not empty'],
    'Phone': ['Contains', 'Does not contain', 'Starts with', 'Ends with', 'Is empty', 'Is not empty'],
    'Company': ['Contains', 'Does not contain', 'Starts with', 'Ends with', 'Is empty', 'Is not empty'],
    'Department': ['Contains', 'Does not contain', 'Starts with', 'Ends with', 'Is empty', 'Is not empty'],
    'Category': ['Any of', 'None of', 'Is empty', 'Is not empty'],
    'Tags': ['Any of', 'None of', 'Is empty', 'Is not empty'],
    'Author': ['Any of', 'None of', 'Is empty', 'Is not empty'],
    'Status': ['Any of', 'None of', 'Is empty', 'Is not empty'],
    'Priority': ['Any of', 'None of', 'Is empty', 'Is not empty'],
    'Assignee': ['Any of', 'None of', 'Is empty', 'Is not empty'],
    'Customer': ['Any of', 'None of', 'Is empty', 'Is not empty'],
    'Created Date': ['Before', 'After', 'Between', 'On', 'Is empty', 'Is not empty'],
    'Updated Date': ['Before', 'After', 'Between', 'On', 'Is empty', 'Is not empty'],
    'Published Date': ['Before', 'After', 'Between', 'On', 'Is empty', 'Is not empty'],
    'Last Contact': ['Before', 'After', 'Between', 'On', 'Is empty', 'Is not empty'],
    'Views': ['Greater than', 'Less than', 'Equals', 'Between', 'Is empty', 'Is not empty'],
    'All fields': ['Matches any', 'Does not match', 'Is empty', 'Is not empty']
  };

  // Status options for different search types
  const statusOptionsMap = {
    knowledgebase: ['published', 'draft', 'archived', 'review'],
    article: ['published', 'draft', 'archived', 'pending'],
    contact: ['active', 'inactive', 'lead', 'customer', 'prospect'],
    ticket: ['open', 'in-progress', 'resolved', 'closed', 'pending', 'cancelled']
  };

  // Priority options for tickets
  const priorityOptions = ['low', 'medium', 'high', 'urgent', 'critical'];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSearchTypeChange = (searchType: SearchType) => {
    setSelectedSearchType(searchType);
    // Reset filters when search type changes
    setFilters([{ id: '1', field: fieldOptionsMap[searchType][0], operator: 'Contains', value: '' }]);
  };

  const handleFilterChange = (id: string, field: 'field' | 'operator' | 'value', value: string) => {
    setFilters(prev => prev.map(filter => 
      filter.id === id ? { ...filter, [field]: value } : filter
    ));
  };

  const addFilter = () => {
    const newFilter: FilterRow = {
      id: Date.now().toString(),
      field: fieldOptionsMap[selectedSearchType][0],
      operator: 'Contains',
      value: ''
    };
    setFilters(prev => [...prev, newFilter]);
  };

  const removeFilter = (id: string) => {
    setFilters(prev => prev.filter(filter => filter.id !== id));
  };

  const renderValueInput = (filter: FilterRow) => {
    const currentFieldOptions = fieldOptionsMap[selectedSearchType];
    const currentStatusOptions = statusOptionsMap[selectedSearchType];

    if (filter.field === 'Status') {
      return (
        <Box sx={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {currentStatusOptions.map((status, index) => (
            <FormControlLabel
              key={index}
              control={<Checkbox size="small" />}
              label={status}
              sx={{ 
                minWidth: '30%',
                '& .MuiFormControlLabel-label': { 
                  fontSize: '0.75rem',
                  color: '#666'
                } 
              }}
            />
          ))}
        </Box>
      );
    }

    if (filter.field === 'Priority') {
      return (
        <Box sx={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {priorityOptions.map((priority, index) => (
            <FormControlLabel
              key={index}
              control={<Checkbox size="small" />}
              label={priority}
              sx={{ 
                minWidth: '30%',
                '& .MuiFormControlLabel-label': { 
                  fontSize: '0.75rem',
                  color: '#666'
                } 
              }}
            />
          ))}
        </Box>
      );
    }

    if (filter.field === 'Assignee' || filter.field === 'Customer' || filter.field === 'Author') {
      return (
        <TextField
          size="small"
          placeholder="One or more names"
          value={filter.value}
          onChange={(e) => handleFilterChange(filter.id, 'value', e.target.value)}
          sx={{ flex: 1 }}
        />
      );
    }

    if (filter.field.includes('Date')) {
      return (
        <TextField
          size="small"
          type="date"
          value={filter.value}
          onChange={(e) => handleFilterChange(filter.id, 'value', e.target.value)}
          sx={{ flex: 1 }}
        />
      );
    }

    return (
      <TextField
        size="small"
        placeholder="Enter value"
        value={filter.value}
        onChange={(e) => handleFilterChange(filter.id, 'value', e.target.value)}
        sx={{ flex: 1 }}
      />
    );
  };

  const steps = [
    {
      label: 'Select Search Type',
      content: (
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            What would you like to search?
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
            {searchTypes.map((type) => (
              <Button
                key={type.value}
                variant={selectedSearchType === type.value ? "contained" : "outlined"}
                startIcon={type.icon}
                onClick={() => handleSearchTypeChange(type.value as SearchType)}
                sx={{
                  py: 2,
                  px: 3,
                  textTransform: 'none',
                  justifyContent: 'flex-start',
                  '&.MuiButton-contained': {
                    backgroundColor: '#1a73e8',
                    '&:hover': { backgroundColor: '#1557b0' }
                  }
                }}
              >
                {type.label}
              </Button>
            ))}
          </Box>
        </Box>
      )
    },
    {
      label: 'Build Query',
      content: (
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Advanced search query builder
          </Typography>
          
          {/* Logic Operator */}
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Match:
            </Typography>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={logicOperator}
                onChange={(e) => setLogicOperator(e.target.value)}
                sx={{ 
                  '& .MuiSelect-select': { 
                    py: 0.5,
                    fontSize: '0.875rem'
                  } 
                }}
              >
                <MenuItem value="AND">Match all (AND)</MenuItem>
                <MenuItem value="OR">Match any (OR)</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Filter Rows */}
          <Box sx={{ maxHeight: 300, overflowY: 'auto',  }}>
            {filters.map((filter, index) => (
              <Box key={filter.id} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                {/* Field Dropdown */}
                <FormControl  sx={{ minWidth: 120 }}>
                  <Select
                    value={filter.field}
                    onChange={(e) => handleFilterChange(filter.id, 'field', e.target.value)}
                    sx={{ 
                      '& .MuiSelect-select': { 
                        py: 0.5,
                        fontSize: '0.875rem'
                      } 
                    }}
                  >
                    {fieldOptionsMap[selectedSearchType].map((option) => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Operator Dropdown */}
                <FormControl  sx={{ minWidth: 120 }}>
                  <Select
                    value={filter.operator}
                    onChange={(e) => handleFilterChange(filter.id, 'operator', e.target.value)}
                    sx={{ 
                      '& .MuiSelect-select': { 
                        py: 0.5,
                        fontSize: '0.875rem'
                      } 
                    }}
                  >
                    {operatorOptions[filter.field as keyof typeof operatorOptions]?.map((option) => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Value Input */}
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  {renderValueInput(filter)}
                  
                  {/* Remove Button */}
                  <IconButton
                    size="small"
                    onClick={() => removeFilter(filter.id)}
                    sx={{ color: '#666', ml: 1 }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            ))}

            {/* Add Filter Button */}
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addFilter}
              sx={{ 
                mt: 1,
                borderColor: '#dadce0',
                color: '#000',
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#dadce0',
                  backgroundColor: '#f8f9fa'
                }
              }}
            >
              Add Filter
            </Button>
          </Box>
        </Box>
      )
    }
  ];

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="top"
      style={{ zIndex: 1300 }}
      modifiers={[
        { name: 'offset', options: { offset: [0, 16] } },
      ]}
    >
      <Paper
        ref={popupRef}
        elevation={8}
        sx={{
          width: 900,
          maxHeight: 500,
          borderRadius: 2,
          overflow: 'visible',
          backgroundColor: '#fff',
          border: '1px solid #e0e0e0',
          position: 'relative',
          // Arrow tip border (larger, behind)
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -9,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '9px solid transparent',
            borderRight: '9px solid transparent',
            borderBottom: '9px solid #e0e0e0',
            zIndex: -1,
          },
          // Arrow tip (smaller, on top)
          '&::after': {
            content: '""',
            position: 'absolute',
            top: -8,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderBottom: '8px solid #fff',
            filter: 'drop-shadow(0 -1px 1px rgba(0,0,0,0.1))',
          },
        }}
      >
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#000' }}>
            Advanced Search
          </Typography>
          <IconButton size="small" onClick={onClose} sx={{ color: '#666' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Stepper */}
        <Box sx={{ p: 2, maxHeight: 400, overflowY: 'auto' }}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel>{step.label}</StepLabel>
                <StepContent>
                  {step.content}
                  <Box sx={{ mb: 2, mt: 2 }}>
                    <div>
                      <Button
                        variant="contained"
                        onClick={index === steps.length - 1 ? onClose : handleNext}
                        sx={{ 
                          mr: 1,
                          backgroundColor: '#1a73e8',
                          textTransform: 'none',
                          '&:hover': { backgroundColor: '#1557b0' }
                        }}
                      >
                        {index === steps.length - 1 ? 'Search' : 'Continue'}
                      </Button>
                      <Button
                        disabled={index === 0}
                        onClick={handleBack}
                        sx={{ textTransform: 'none' }}
                      >
                        Back
                      </Button>
                    </div>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Footer */}
        <Box sx={{ 
          p: 2, 
          pt: 1.5,
          pb: 1.5,
          borderTop: '1px solid #e0e0e0',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          backgroundColor: '#fff',
          minHeight: '48px',
          boxShadow: '0 -2px 8px rgba(0,0,0,0.1)',
          borderRadius: '0 0 8px 8px'
        }}>
          <Button
            variant="text"
            startIcon={<OpenInNewIcon />}
            sx={{ 
              color: '#1a73e8',
              textTransform: 'none',
              fontSize: '0.875rem',
              minWidth: 'auto',
              padding: '4px 8px',
              '&:hover': {
                backgroundColor: 'transparent',
                textDecoration: 'underline'
              }
            }}
          >
            Search help
          </Button>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#666',
              fontSize: '0.875rem',
              fontWeight: 500,
              minWidth: 'fit-content'
            }}
          >
            Step {activeStep + 1} of {steps.length}
          </Typography>
        </Box>
      </Paper>
    </Popper>
  );
};

export default AdvancedSearchPopup; 