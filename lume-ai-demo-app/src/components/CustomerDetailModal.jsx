import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from  '@/components/ui/sheet';
import {  Card, CardHeader, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import img from 'next/image';

const CustomerDetailSheet = ({ isOpen, onClose, customer }) => {
  return (
    <React.Fragment>
    <Sheet open={isOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Customer Details</SheetTitle>
          <SheetClose />
        </SheetHeader>
        <Card>
          <CardHeader className="flex items-center">
            <img
              src={`https://i.pravatar.cc/80?u=${customer.email}`}
              alt={customer.name}
              className="w-16 h-16 rounded-full mr-4"
            />
            <p>{customer.name}</p>
          </CardHeader>
          <Separator />
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p type="secondary">Customer ID</p>
                <p>{customer.id}</p>
              </div>
              <div>
                <p type="secondary">Email</p>
                <p>{customer.email}</p>
              </div>
              <div>
                <p type="secondary">Gender</p>
                <p>{customer.gender}</p>
              </div>
              <div>
                <p type="secondary">Mobile</p>
                <p>{customer.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </SheetContent>
    </Sheet>
    </React.Fragment>
  );
};

export default CustomerDetailSheet