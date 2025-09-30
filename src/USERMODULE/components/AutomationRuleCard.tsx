import React from 'react'
import { Card, CardContent, Typography, Switch, IconButton, Divider, Box, Stack } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'

export type AutomationRule = {
  id: string
  index: number
  title: string
  description: string
  lastModified: string
  by: string
  impactedTickets: string
  enabled: boolean
}

type AutomationRuleCardProps = {
  rule: AutomationRule
  onToggle?: (id: string, enabled: boolean) => void
  onMenuClick?: (id: string) => void
}

const AutomationRuleCard: React.FC<AutomationRuleCardProps> = ({ rule, onToggle, onMenuClick }) => {
  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    onToggle?.(rule.id, event.target.checked)
  }

  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box display="flex" alignItems="flex-start" justifyContent="space-between">
          <Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="subtitle1" color="text.secondary">{rule.index}.</Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>{rule.title}</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.25 }}>
              {rule.description}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={0.5}>
            <Switch color="success" checked={rule.enabled} onChange={handleToggle} inputProps={{ 'aria-label': 'enable rule' }} />
            <IconButton aria-label="more" onClick={() => onMenuClick?.(rule.id)}>
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
          <Typography variant="body2" color="text.secondary">
            <strong>Last Modified</strong> : {rule.lastModified}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>By</strong> : {rule.by}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Impacted tickets (Last 7 days)</strong> : {rule.impactedTickets}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default AutomationRuleCard


