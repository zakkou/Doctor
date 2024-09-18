import React, { useMemo, useEffect } from 'react';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { API_URL } from "../env";
import "../assets/styles/styles.css"
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
const SecretaryTable = () => {
  const navigate = useNavigate()
  const [data, setData] = React.useState([]);
  const { user } = useSelector((state) => state.user);
  const token = user.token;

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/getAllPayment/${user.user._secretary.doctorId}`, {
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
      { accessorKey: 'amountPaid', header: 'Montant' },
      { accessorKey: 'date', header: 'date' },
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
    navigate('/dashboard/paiement/edit-payment/' + secretary._id, { state: secretary })
  };

  const handleDelete = async (prescription) => {
    if (window.confirm(`Voulez-vous vraiment supprimer la paiement ${prescription.patientName}?`)) {
      try {
        await axios.delete(`${API_URL}/api/deletePayment/${prescription._id}`, {
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
  const handleDownload = async (prescription) => {
    console.log('prescription',prescription)
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Reçu de Paiement', 20, 20);
    doc.setFontSize(12);
    doc.text(`Docteur : ${prescription?.paymentDoctor?.name}`, 20, 40);
    doc.text(`Patient : ${prescription.patientName}`, 20, 50);
    doc.text(`Date : ${prescription.date}`, 20, 60);
    doc.text(`Montant payé : ${prescription.amountPaid} €`, 20, 70);
    doc.text('Détails du paiement :', 20, 80);
    doc.text(`${prescription.paymentDetails}`, 20, 90);

    // Sauvegarde le fichier PDF
    doc.save(`recu_paiement_${prescription.patientName}.pdf`);
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

export default SecretaryTable;

