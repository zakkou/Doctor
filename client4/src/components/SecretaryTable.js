import React, { useMemo , useEffect} from 'react';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { API_URL } from "../env";
import "../assets/styles/styles.css"
import { useNavigate } from 'react-router-dom';
const SecretaryTable = () => {
  const [data, setData] = React.useState([]);
  const { user } = useSelector((state) => state.user);
  const token = user.token;
  const navigate = useNavigate()
  useEffect(() => {
    const fetchSecretaries = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/getAllsec/${user.user._id}`, {
          headers: {
            Authorization: `${token}`,
          }
        });
        setData(response.data);
      } catch (error) {
        console.error("Error fetching secretaries", error);
      }
    };
    fetchSecretaries();
  }, [user, token]);
  const handleDelete = async (prescription) => {
    if (window.confirm(`Voulez-vous vraiment supprimer l'ordonnance pour le patient ${prescription.patientName}?`)) {
      try {
        await axios.delete(`${API_URL}/api/deleteSecretary/${prescription._id}`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        // Met à jour l'état local pour retirer l'ordonnance supprimée
        setData(prevData => prevData.filter(item => item._id !== prescription._id));
        console.log('Ordonnance supprimée avec succès');
      } catch (error) {
        console.error("Erreur lors de la suppression de l'ordonnance", error);
      }
    }
  };
  const columns = useMemo(
    () => [
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'email', header: 'Email' },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-edit" onClick={() => handleEdit(row.original)}>Edit</button>
            <button className="btn btn-delete" onClick={() => handleDelete(row.original)}>Delete</button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleEdit = (secretary) => {
    navigate('/dashboard/secretary/edit-secretary/'+secretary._id, { state: secretary })
  };


  return (
    <div style={{ marginTop: "60px"}}>
     
      <table className="table">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SecretaryTable;

