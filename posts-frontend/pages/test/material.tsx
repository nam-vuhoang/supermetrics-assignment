import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { Pagination } from '@mui/material';

function TestMaterial() {
  return (
    <>
      <Tooltip title="Delete">
        <IconButton>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
      <Pagination count={10} />
    </>
  );
}

export default TestMaterial;
