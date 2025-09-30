import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Divider,
  Avatar,
  InputAdornment,
} from '@mui/material';
import {
  Close,
  Send,
  Person,
  Email,
  Phone,
  Business,
  Assignment,
  PriorityHigh,
  LocalOffer,
  Schedule,
  Description,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface QuickCreateFormProps {
  open: boolean;
  onClose: () => void;
  type: 'email' | 'ticket' | 'task' | 'contact' | 'meeting';
  contactId?: number;
  contactName?: string;
  contactEmail?: string;
}

const QuickCreateForm: React.FC<QuickCreateFormProps> = ({
  open,
  onClose,
  type,
  contactId,
  contactName,
  contactEmail,
}) => {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    priority: 'medium',
    assignee: '',
    dueDate: '',
    tags: [] as string[],
    contactName: contactName || '',
    contactEmail: contactEmail || '',
    contactPhone: '',
    contactCompany: '',
  });

  const [tagInput, setTagInput] = useState('');

  const getFormTitle = () => {
    switch (type) {
      case 'email':
        return 'Send Email';
      case 'ticket':
        return 'Create Ticket';
      case 'task':
        return 'Create Task';
      case 'contact':
        return 'Add Contact';
      case 'meeting':
        return 'Schedule Meeting';
      default:
        return 'Quick Action';
    }
  };

  const getFormIcon = () => {
    switch (type) {
      case 'email':
        return <Email />;
      case 'ticket':
        return <Assignment />;
      case 'task':
        return <Assignment />;
      case 'contact':
        return <Person />;
      case 'meeting':
        return <Schedule />;
      default:
        return <Send />;
    }
  };

  const handleSubmit = () => {
    // Handle form submission based on type
    console.log('Form submitted:', { type, formData, contactId });
    onClose();
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const renderFormFields = () => {
    switch (type) {
      case 'email':
        return (
          <>
            <TextField
              fullWidth
              label="To"
              value={contactEmail || formData.contactEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Subject"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Message"
              multiline
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              sx={{ mb: 2 }}
            />
          </>
        );

      case 'ticket':
        return (
          <>
            <TextField
              fullWidth
              label="Subject"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Priority</InputLabel>
              <Select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                startAdornment={
                  <InputAdornment position="start">
                    <PriorityHigh />
                  </InputAdornment>
                }
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="urgent">Urgent</MenuItem>
              </Select>
            </FormControl>
          </>
        );

      case 'task':
        return (
          <>
            <TextField
              fullWidth
              label="Task Title"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Due Date"
              type="datetime-local"
              value={formData.dueDate}
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Priority</InputLabel>
              <Select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="urgent">Urgent</MenuItem>
              </Select>
            </FormControl>
          </>
        );

      case 'contact':
        return (
          <>
            <TextField
              fullWidth
              label="Full Name"
              value={formData.contactName}
              onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Phone"
              value={formData.contactPhone}
              onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Company"
              value={formData.contactCompany}
              onChange={(e) => setFormData(prev => ({ ...prev, contactCompany: e.target.value }))}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Business />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
          </>
        );

      case 'meeting':
        return (
          <>
            <TextField
              fullWidth
              label="Meeting Title"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={2}
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Start Date & Time"
              type="datetime-local"
              value={formData.dueDate}
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Attendees"
              placeholder="Enter email addresses separated by commas"
              value={formData.contactEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
              sx={{ mb: 2 }}
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', color: 'white' }}>
              {getFormIcon()}
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {getFormTitle()}
            </Typography>
            <Box sx={{ flex: 1 }} />
            <IconButton onClick={onClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 3 }}>
          {renderFormFields()}

          {/* Tags section for applicable forms */}
          {(type === 'ticket' || type === 'task') && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Tags
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                {formData.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  size="small"
                  placeholder="Add tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  sx={{ flex: 1 }}
                />
                <Button
                  variant="outlined"
                  onClick={handleAddTag}
                  disabled={!tagInput.trim()}
                  size="small"
                >
                  Add
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            startIcon={<Send />}
            disabled={!formData.subject.trim()}
          >
            {type === 'email' ? 'Send' : type === 'contact' ? 'Add Contact' : 'Create'}
          </Button>
        </DialogActions>
      </motion.div>
    </Dialog>
  );
};

export default QuickCreateForm;
