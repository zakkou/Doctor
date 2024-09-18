import React, { useMemo, useEffect } from 'react';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { API_URL } from "../env";
import "../assets/styles/styles.css"
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
const PrescriptionTable = () => {
  const navigate = useNavigate()
  const [data, setData] = React.useState([]);
  const { user } = useSelector((state) => state.user);
  const token = user.token;
  const doctorId = user?._secretary?.doctorId ?? user?.user?._id;
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/getAllPrescriptions/${doctorId}`, {
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
  const handleDelete = async (prescription) => {
    if (window.confirm(`Voulez-vous vraiment supprimer l'ordonnance pour le patient ${prescription.patientName}?`)) {
      try {
        await axios.delete(`${API_URL}/api/deletePrescription/${prescription._id}`, {
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
      { accessorKey: 'patientName', header: 'Patient' },
      {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }) => moment(row.original.date).format('DD/MM/YYYY'), // Formattage avec Moment.js
      },

      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-edit" onClick={() => handleEdit(row.original)}>Edit</button>
            <button className="btn btn-delete" onClick={() => handleDelete(row.original)}>Delete</button>
            <button className="btn btn-delete" onClick={() => handleDownload(row.original)}>Télécharger</button>
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
    navigate('/dashboard/ordonnance/edit-prescription/' + secretary._id, { state: secretary })
  };

  const handleDownload = async (prescription) => { 
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Ordonnance Médicale', 20, 20);
    doc.setFontSize(12);
    doc.text(`Docteur : ${prescription.doctorName}`, 20, 40);
    doc.text(`Patient : ${prescription.patientName}`, 20, 50);
    doc.text(`Date : ${ moment(prescription.date).format('DD/MM/YYYY') }`, 20, 60);
    doc.text('Médicaments :', 20, 70);
    doc.text(`${prescription.medications}`, 20, 80);

    // Sauvegarde le fichier PDF
    doc.save(`ordonnance_${prescription.patientName}.pdf`);
  }
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

export default PrescriptionTable;


