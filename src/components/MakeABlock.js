import React from 'react';
import { Button, Dialog, DialogContent, DialogActions, TextField, Checkbox, FormControlLabel } from '@material-ui/core';
import { Close } from '@material-ui/icons';

export default function MakeABlock({ open, onClose, newBlockName, onNewBlockNameChange, runWithoutRefresh, onRunWithoutRefreshChange, onAddNewBlock }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <div className="bg-purple-600 text-white p-4 flex justify-between items-center">
        <h2>Make a Block</h2>
        <Close onClick={onClose} className="cursor-pointer" />
      </div>
      <DialogContent>
        <div className="flex justify-center my-4">
          <Button variant="contained" style={{backgroundColor: '#ff69b4', color: 'white'}}>
            {newBlockName || 'my block'}
          </Button>
        </div>
        <div className="flex justify-between mb-4">
          <Button variant="contained" style={{backgroundColor: '#4CAF50', color: 'white'}}>
            ADD NUMBER/TEXT
          </Button>
          <Button variant="contained" style={{backgroundColor: '#2196F3', color: 'white'}}>
            ADD BOOLEAN
          </Button>
          <Button variant="contained" style={{backgroundColor: '#FFC107', color: 'white'}}>
            ADD LABEL
          </Button>
        </div>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Block Name"
          type="text"
          fullWidth
          value={newBlockName}
          onChange={onNewBlockNameChange}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={runWithoutRefresh}
              onChange={onRunWithoutRefreshChange}
              color="primary"
            />
          }
          label="Run without screen refresh"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          CANCEL
        </Button>
        <Button onClick={onAddNewBlock} color="primary" variant="contained">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
