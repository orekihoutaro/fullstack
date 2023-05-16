import React, { useEffect, useState } from 'react';
import { auth, app } from '../auth.js';
import { motion } from 'framer-motion';

const UserDues = () => {
  const [monthlyDues, setMonthlyDues] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMonthlyDues = async () => {
      try {
        const user = auth.currentUser;

        if (user) {
          const userId = user.uid;

          // Initialize Firestore
          const db = app.firestore();

          // Retrieve the monthly dues data from Firestore
          const doc = await db.collection('users').doc(userId).get();
          const data = doc.data();

          // Set the monthly dues data in the state
          setMonthlyDues(data.duesByDate || {});
        }
      } catch (error) {
        console.error('Error retrieving monthly dues:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMonthlyDues();
  }, []);


  const getMonthName = (monthNumber) => {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString('default', { month: 'long' });
  };

  const sortedMonths = Object.entries(monthlyDues).sort(
    ([monthA], [monthB]) => parseInt(monthA) - parseInt(monthB)
  );

  return (
    <div className="flex flex-col justify-center p-2 m-8 font-medium bg-white border-2 border-blue-600 text-slate-800 rounded-2xl">
      <h2 className="mb-4 text-2xl font-bold">Monthly Dues</h2>
      <ul className="pl-6 list-disc">
        {sortedMonths.map(([month, amount]) => (
          <li key={month} className="text-lg">
            {getMonthName(parseInt(month))}: {amount}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserDues;
