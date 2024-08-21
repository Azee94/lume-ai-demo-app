'use client'

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FixedSizeList as List } from 'react-window';

// Import the data
import testData from '@/data/test_dataset.json';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [listHeight, setListHeight] = useState(400); // Default height
  const containerRef = useRef(null);

  const filteredData = useMemo(() => {
    return testData.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const updateListHeight = useCallback(() => {
    if (containerRef.current) {
      const windowHeight = window.innerHeight;
      const containerTop = containerRef.current.getBoundingClientRect().top;
      const newHeight = windowHeight - containerTop - 20; // 20px for some bottom margin
      setListHeight(Math.max(200, newHeight)); // Ensure a minimum height of 200px
    }
  }, []);

  useEffect(() => {
    updateListHeight();
    window.addEventListener('resize', updateListHeight);
    return () => window.removeEventListener('resize', updateListHeight);
  }, [updateListHeight]);

  const Row = useCallback(({ index, style }) => {
    const customer = filteredData[index];
    return (
      <div style={style} className="flex justify-between items-center p-2 border-b">
        <div>
          <div className="font-bold">{customer.name}</div>
          <div className="text-sm text-muted-foreground">{customer.email}</div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" onClick={() => setSelectedCustomer(customer)}>...</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{customer.name} Details</DialogTitle>
            </DialogHeader>
            <div>
              <p><strong>Email:</strong> {customer.email}</p>
              <p><strong>Phone:</strong> {customer.phone}</p>
              <p><strong>Gender:</strong> {customer.gender}</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }, [filteredData]);

  return (
    <div className="container mx-auto p-4" ref={containerRef}>
      <h1 className="text-2xl font-bold mb-4">Customer Dashboard</h1>
      <Input
        type="text"
        placeholder="Search customers..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <List
        height={listHeight}
        itemCount={filteredData.length}
        itemSize={50}
        width="100%"
      >
        {Row}
      </List>
    </div>
  );
};

export default Dashboard;