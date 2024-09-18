import React, { useMemo, useEffect } from 'react';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { API_URL } from "../env";
import "../assets/styles/styles.css"
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
const AppointmentTable = () => {
  const navigate = useNavigate()
  const [data, setData] = React.useState([]);
  const { user } = useSelector((state) => state.user);
  const token = user.token;
  const doctorId = user?.user?._secretary?.doctorId ?? user?.user?._id;
  useEffect(() => {
    const fetchPayments = async () => {
      console.log('user', user)
      console.log('doctorId', doctorId)
      try {
        const response = await axios.get(`${API_URL}/api/getAllReservation/${doctorId}`, {
          headers: {
            Authorization: `${token}`,
          }
        });
        setData(response.data);
      } catch (error) {
        console.error("Error fetching secretaries", error);
      }
    };
    fetchPayments(); 
  }, [user, token]);

  const columns = useMemo(
    () => [
      { accessorKey: 'patientName', header: 'nom' },
      {
        accessorKey: 'appointmentDate',
        header: 'Date',
        cell: ({ row }) => moment(row.original.appointmentDate).format('DD/MM/YYYY'), // Formattage avec Moment.js
      },
      { accessorKey: 'appointmentTime', header: 'heure' },
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
    navigate('/dashboard/appointment/edit-appointment/'+secretary._id, { state: secretary })
  };

  const handleDelete = async (prescription) => {
    if (window.confirm(`Voulez-vous vraiment supprimer la reservation pour le patient ${prescription.patientName}?`)) {
      try {
        await axios.delete(`${API_URL}/api/deleteReservation/${prescription._id}`, {
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
  return (
    <div style={{ marginTop: "60px" }}>

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

export default AppointmentTable;


