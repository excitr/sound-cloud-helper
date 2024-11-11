import { useState, type MouseEvent } from 'react';
import { Box, Button, IconButton, Menu, MenuItem } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

interface EmailDropdownProps {
  userEmail: string;
  handleMenuClick: (event: MouseEvent<HTMLButtonElement>) => void;
  anchorEl: HTMLElement | null;
  handleMenuClose: () => void;
  handleSignOut: () => void;
}

function EmailDropdown({
  userEmail,
  handleMenuClick,
  anchorEl,
  handleMenuClose,
  handleSignOut,
}: EmailDropdownProps): React.JSX.Element {
  // Use React.JSX.Element
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box display="flex" alignItems="center" gap={1}>
      {isHovered ? (
        <Button
          variant="outlined"
          endIcon={<ArrowDropDownIcon />}
          onClick={handleMenuClick}
          onMouseLeave={() => {
            setIsHovered(false);
          }}
          sx={{
            borderColor: '#444',
            borderRadius: '50px',
            textTransform: 'none',
            color: '#444',
            paddingLeft: '10px',
            paddingRight: '10px',
            '&:hover': {
              borderColor: '#444',
              color: '#444',
            },
          }}
        >
          {userEmail}
        </Button>
      ) : (
        <IconButton
          size="small"
          onMouseEnter={() => {
            setIsHovered(true);
          }}
          sx={{ border: '1px solid #444', borderRadius: '50%', padding: '4px', color: '#444' }}
        >
          <ArrowDropDownIcon fontSize="inherit" />
        </IconButton>
      )}

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleMenuClose}>Account Settings</MenuItem>
        <MenuItem onClick={handleSignOut}>Logout</MenuItem>
      </Menu>
    </Box>
  );
}

export default EmailDropdown;
