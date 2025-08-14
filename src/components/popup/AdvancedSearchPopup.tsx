/**
 * AdvancedSearchPopup Component
 * 
 * A comprehensive advanced search component that supports multiple search types:
 * - Knowledge Base
 * - Articles  
 * - Contacts
 * - Tickets
 * 
 * Features:
 * - Multi-step search builder
 * - Dynamic field and operator options
 * - Checkbox selections for Status and Priority
 * - Date range filtering
 * - Loading states with progress indicator
 * - API integration with proper payload structure
 * 
 * Usage:
 * ```tsx
 * <AdvancedSearchPopup
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   anchorEl={anchorElement}
 *   onSearchComplete={(results) => {
 *     console.log('Search results:', results);
 *     // Handle search results
 *   }}
 * />
 * ```
 * 
 * API Endpoint: POST /ticket/staff/advance-search
 * Payload Structure:
 * {
 *   searchType: 'ticket' | 'knowledgebase' | 'article' | 'contact',
 *   logicOperator: 'and' | 'or',
 *   filters: [
 *     {
 *       field: 'subject' | 'status' | 'priority' | etc.,
 *       operator: 'contains' | 'equals' | 'any_of' | etc.,
 *       value: string | string[] | Date
 *     }
 *   ]
 * }
 */

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
  StepContent,
  CircularProgress
} from '@mui/material';
import { 
  Close as CloseIcon, 
  Add as AddIcon,
  OpenInNew as OpenInNewIcon,
  Search as SearchIcon,
  Article as ArticleIcon,
  ContactSupport as ContactIcon,
  ConfirmationNumber as TicketIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useAdvancedSearchMutation } from '../../services/ticketAuth';

interface AdvancedSearchPopupProps {
  open: boolean;
  onClose: () => void;
  anchorEl: HTMLElement | null;
  onSearchComplete?: (results: SearchResult) => void;
}

interface FilterRow {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface SearchPayload {
  searchType: string;
  logicOperator: string;
  filters: Array<{
    field: string;
    operator: string;
    value: string | string[] | Date;
  }>;
}

interface SearchResult {
  success: boolean;
  data?: any;
  message?: string;
  total?: number;
  results?: any[];
}

type SearchType = 'knowledgebase' | 'article' | 'contact' | 'ticket';

const AdvancedSearchPopup: React.FC<AdvancedSearchPopupProps> = ({ open, onClose, anchorEl, onSearchComplete }) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedSearchType, setSelectedSearchType] = useState<SearchType>('ticket');
  const [logicOperator, setLogicOperator] = useState('AND');
  const [filters, setFilters] = useState<FilterRow[]>([
    { id: '1', field: 'Title', operator: 'Contains', value: '' }
  ]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  
  // API hook
  const [advancedSearch, { isLoading }] = useAdvancedSearchMutation();

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

  // Get available fields for a specific filter (excluding already selected fields)
  const getAvailableFields = (currentFilterId: string) => {
    const allFields = fieldOptionsMap[selectedSearchType];
    const selectedFields = filters
      .filter(filter => filter.id !== currentFilterId) // Exclude current filter
      .map(filter => filter.field);
    
    return allFields.filter(field => !selectedFields.includes(field));
  };

  // Check if a specific filter has valid criteria
  const isFilterComplete = (filter: FilterRow): boolean => {
    if (filter.field === 'Status') {
      return selectedStatuses.length > 0;
    }
    if (filter.field === 'Priority') {
      return selectedPriorities.length > 0;
    }
    return Boolean(filter.value && filter.value.trim() !== '');
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
    // Reset selected statuses and priorities when search type changes
    setSelectedStatuses([]);
    setSelectedPriorities([]);
  };

  const handleFilterChange = (id: string, field: 'field' | 'operator' | 'value', value: string) => {
    setFilters(prev => prev.map(filter => {
      if (filter.id === id) {
        const updatedFilter = { ...filter, [field]: value };
        
        // If field is being changed, reset the value and operator to defaults
        if (field === 'field') {
          updatedFilter.value = '';
          updatedFilter.operator = (operatorOptions[value as keyof typeof operatorOptions]?.[0] || 'Contains');
        }
        
        return updatedFilter;
      }
      return filter;
    }));
  };

  const addFilter = () => {
    // Check if we've reached the maximum limit of 5 filters
    if (filters.length >= 5) {
      alert('Maximum 5 filters allowed. Please remove a filter to add a new one.');
      return;
    }
    
    // Get available fields (not already selected)
    const availableFields = getAvailableFields('');
    
    if (availableFields.length === 0) {
      alert('All available fields have been used. Please remove a filter to add a new one.');
      return;
    }
    
    const newFilter: FilterRow = {
      id: Date.now().toString(),
      field: availableFields[0], // Use first available field
      operator: (operatorOptions[availableFields[0] as keyof typeof operatorOptions]?.[0] || 'Contains'),
      value: ''
    };
    setFilters(prev => [...prev, newFilter]);
  };

  const removeFilter = (id: string) => {
    setFilters(prev => {
      const updatedFilters = prev.filter(filter => filter.id !== id);
      
      // If no filters left, add a default one
      if (updatedFilters.length === 0) {
        const defaultFilter: FilterRow = {
          id: Date.now().toString(),
          field: fieldOptionsMap[selectedSearchType][0],
          operator: 'Contains',
          value: ''
        };
        return [defaultFilter];
      }
      
      return updatedFilters;
    });
  };

  // Handle status checkbox changes
  const handleStatusChange = (status: string) => {
    setSelectedStatuses(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  // Handle priority checkbox changes
  const handlePriorityChange = (priority: string) => {
    setSelectedPriorities(prev => 
      prev.includes(priority) 
        ? prev.filter(p => p !== priority)
        : [...prev, priority]
    );
  };

  // Field mapping for backend compatibility
  const fieldMapping: { [key: string]: string } = {
    'Subject': 'subject',
    'Description': 'description',
    'Status': 'status',
    'Priority': 'priority',
    'Assignee': 'assignee',
    'Customer': 'customer',
    'Created Date': 'created_date',
    'Updated Date': 'updated_date',
    'Category': 'category',
    'Title': 'title',
    'Content': 'content',
    'Tags': 'tags',
    'Author': 'author',
    'Published Date': 'published_date',
    'Name': 'name',
    'Email': 'email',
    'Phone': 'phone',
    'Company': 'company',
    'Department': 'department',
    'Last Contact': 'last_contact',
    'Views': 'views',
    'All fields': 'all_fields'
  };

  // Operator mapping for backend compatibility
  const operatorMapping: { [key: string]: string } = {
    'Contains': 'contains',
    'Does not contain': 'not_contains',
    'Starts with': 'starts_with',
    'Ends with': 'ends_with',
    'Is empty': 'is_empty',
    'Is not empty': 'is_not_empty',
    'Any of': 'any_of',
    'None of': 'none_of',
    'Before': 'before',
    'After': 'after',
    'Between': 'between',
    'On': 'on',
    'Greater than': 'greater_than',
    'Less than': 'less_than',
    'Equals': 'equals',
    'Matches any': 'matches_any',
    'Does not match': 'does_not_match'
  };

  // Build the search payload
  const buildSearchPayload = () => {
    const payload = {
      searchType: selectedSearchType,
      logicOperator: logicOperator.toLowerCase(),
      filters: filters.map(filter => {
        const filterData: any = {
          field: fieldMapping[filter.field] || filter.field.toLowerCase(),
          operator: operatorMapping[filter.operator] || filter.operator.toLowerCase(),
        };

        // Handle different field types
        if (filter.field === 'Status') {
          filterData.value = selectedStatuses;
        } else if (filter.field === 'Priority') {
          filterData.value = selectedPriorities;
        } else if (filter.field.includes('Date')) {
          filterData.value = filter.value;
        } else {
          filterData.value = filter.value;
        }

        return filterData;
      }).filter(filter => {
        // Filter out empty values
        if (Array.isArray(filter.value)) {
          return filter.value.length > 0;
        }
        return filter.value && filter.value.toString().trim() !== '';
      })
    };

    return payload;
  };

  // Validate search criteria
  const validateSearchCriteria = () => {
    // Check for duplicate fields
    const fieldCounts: { [key: string]: number } = {};
    filters.forEach(filter => {
      fieldCounts[filter.field] = (fieldCounts[filter.field] || 0) + 1;
    });
    
    const duplicateFields = Object.entries(fieldCounts)
      .filter(([field, count]) => count > 1)
      .map(([field]) => field);
    
    if (duplicateFields.length > 0) {
      alert(`Duplicate fields detected: ${duplicateFields.join(', ')}. Please remove duplicates.`);
      return false;
    }

    // Check each filter for proper criteria
    const incompleteFilters: string[] = [];
    
    filters.forEach((filter, index) => {
      let hasValue = false;
      
      if (filter.field === 'Status') {
        hasValue = selectedStatuses.length > 0;
      } else if (filter.field === 'Priority') {
        hasValue = selectedPriorities.length > 0;
      } else {
        hasValue = Boolean(filter.value && filter.value.trim() !== '');
      }
      
      if (!hasValue) {
        incompleteFilters.push(`${filter.field} (Filter ${index + 1})`);
      }
    });

    if (incompleteFilters.length > 0) {
      alert(`Please select proper criteria for the following filters:\n${incompleteFilters.join('\n')}`);
      return false;
    }

    return true;
  };

  // Handle search submission
  const handleSearch = async () => {
    if (!validateSearchCriteria()) {
      return;
    }

    try {
      const payload = buildSearchPayload();
      console.log('Advanced Search Payload:', payload);
      
      const result = await advancedSearch(payload).unwrap();
      console.log('Search Result:', result);
      
      // Close the popup after successful search
      onClose();
      
      // Pass results back to parent component if callback provided
      if (onSearchComplete) {
        onSearchComplete(result);
      }
      
    } catch (error) {
      console.error('Advanced search failed:', error);
      // You can add error handling here like showing a toast notification
    }
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
              control={
                <Checkbox 
                  size="small" 
                  checked={selectedStatuses.includes(status)}
                  onChange={() => handleStatusChange(status)}
                />
              }
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
              control={
                <Checkbox 
                  size="small" 
                  checked={selectedPriorities.includes(priority)}
                  onChange={() => handlePriorityChange(priority)}
                />
              }
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
                       <Typography variant="body2" sx={{ mb: 2, color: '#666', fontSize: '0.875rem' }}>
              💡 Tip: Each field can only be used once to avoid duplicate criteria. Maximum 5 filters allowed. Available fields are shown in the dropdown.
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

                     {/* Filter Counter */}
           <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <Typography variant="body2" sx={{ color: '#666', fontSize: '0.875rem' }}>
               Filters ({filters.length}/5)
             </Typography>
             {filters.length >= 5 && (
               <Typography variant="body2" sx={{ color: '#d32f2f', fontSize: '0.75rem', fontWeight: 500 }}>
                 Maximum reached
               </Typography>
             )}
          </Box>

          {/* Filter Rows */}
           <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
            {filters.map((filter, index) => (
               <Box 
                 key={filter.id} 
                 sx={{ 
                   mb: 2, 
                   display: 'flex', 
                   alignItems: 'center', 
                   gap: 1,
                   p: 1,
                   borderRadius: 1,
                   border: isFilterComplete(filter) ? 'none' : '1px solid #d32f2f',
                   backgroundColor: isFilterComplete(filter) ? 'transparent' : '#fff5f5'
                 }}
               >
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
                     {getAvailableFields(filter.id).map((option) => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                     {/* Show current field even if it's not in available fields (for display purposes) */}
                     {!getAvailableFields(filter.id).includes(filter.field) && (
                       <MenuItem key={filter.field} value={filter.field} disabled>
                         {filter.field} (Selected)
                       </MenuItem>
                     )}
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
                   
                   {/* Warning Icon for incomplete filters */}
                   {!isFilterComplete(filter) && (
                     <WarningIcon 
                       sx={{ 
                         color: '#d32f2f', 
                         fontSize: '1rem',
                         ml: 0.5
                       }} 
                     />
                   )}
                  
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

                         {/* Add Filter Button - Only show if less than 5 filters */}
             {filters.length < 5 && (
               <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addFilter}
                   disabled={getAvailableFields('').length === 0}
              sx={{ 
                borderColor: '#dadce0',
                color: '#000',
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#dadce0',
                  backgroundColor: '#f8f9fa'
                     },
                     '&:disabled': {
                       borderColor: '#e0e0e0',
                       color: '#999',
                       cursor: 'not-allowed'
                }
              }}
            >
              Add Filter
            </Button>
                 {getAvailableFields('').length > 0 && (
                   <Typography 
                     variant="body2" 
                     sx={{ 
                       color: '#666', 
                       fontSize: '0.75rem',
                       fontStyle: 'italic'
                     }}
                   >
                     ({getAvailableFields('').length} fields available)
                   </Typography>
                 )}
               </Box>
             )}
             
             {/* Show message when max filters reached */}
             {filters.length >= 5 && (
               <Typography 
                 variant="body2" 
                 sx={{ 
                   mt: 1, 
                   color: '#666', 
                   fontSize: '0.875rem',
                   fontStyle: 'italic'
                 }}
               >
                 Maximum 5 filters reached. Remove a filter to add a new one.
               </Typography>
             )}
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
                        onClick={index === steps.length - 1 ? handleSearch : handleNext}
                        disabled={isLoading}
                        startIcon={index === steps.length - 1 && isLoading ? <CircularProgress size={16} color="inherit" /> : undefined}
                        sx={{ 
                          mr: 1,
                          backgroundColor: '#1a73e8',
                          textTransform: 'none',
                          '&:hover': { backgroundColor: '#1557b0' },
                          '&:disabled': {
                            backgroundColor: '#ccc',
                            color: '#666'
                          }
                        }}
                      >
                        {index === steps.length - 1 ? (isLoading ? 'Searching...' : 'Search') : 'Continue'}
                      </Button>
                      <Button
                        disabled={index === 0 || isLoading}
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