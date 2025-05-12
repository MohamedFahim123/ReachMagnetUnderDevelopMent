import React, { useEffect } from 'react'
import { Table } from 'react-bootstrap'
import { usePackageTransactions } from '../../store/PackageCompanyTransactions';

export default function PackageTransactionsTable({loginType, token}) {
        const {
            transactions,
            fetchCompanyTransactions,
        } = usePackageTransactions();
    useEffect(() => {
        fetchCompanyTransactions(loginType);
        }, [loginType, fetchCompanyTransactions]);
        console.log(transactions);
        
  return (
    <>
      <h3 className=' text-capitalize my-3 fs-5 fw-bold'>
                                current package Transactions:
                            </h3>
                            <Table responsive>
                                <thead>
                                    <tr className='table__default__header'>
                                    <th className='text-center'>Name</th>
                                    <th className='text-center'>Package code</th>

                                        <th className='text-center'>Start Date</th>
                                        
                                        <th className='text-center'>Paid</th>
                                        <th className='text-center'>Payment Method</th>
                                        <th className='text-center'>Payment Status</th>
                                        <th className='text-center'>Added By</th>
                                    </tr>
                                </thead>
                                            <tbody>
                                               {
                                                transactions?.map((el, idx)=>(
                                                     <tr key={idx}>
                                                        <td className='text-center py-3'>{el?.package}</td>
                                                        <td className='text-center py-3'>{el?.code}</td>

                                                        <td className='text-center py-3'>{el?.date}</td>
                                                        <td className='text-center py-3'>{el?.paid_amount}</td>
                                                        <td className='text-center py-3'>{el?.payment_method}</td>
                                                        <td className='text-center py-3'>{el?.payment_status}</td>
                                                        <td className='text-center py-3'>{el?.added_by}</td>
                                                     </tr>
                                                ))
                                               }

                                            </tbody>
                            </Table>
    </>
  )
}
