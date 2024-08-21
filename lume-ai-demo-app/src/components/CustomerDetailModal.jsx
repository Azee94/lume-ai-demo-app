import React, { useMemo } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { Mail, Phone, Users } from 'lucide-react';

const CustomerInfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center">
    <Icon className="mr-4 text-gray-400" />
    <div>
      <p className="text-xs text-muted-foreground font-normal">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  </div>
);

const CustomerDetailSheet = ({ isOpen, onClose, customer }) => {
  const handleSheetOpenChange = (open) => {
    if (!open) {
      onClose();
    }
  };

  const customerInfo = useMemo(() => [
    { icon: Mail, label: 'Email', value: customer.email },
    { icon: Users, label: 'Gender', value: customer.gender, className: 'capitalize' },
    { icon: Phone, label: 'Mobile', value: customer.phone },
  ], [customer]);

  return (
    <Sheet open={isOpen} onOpenChange={handleSheetOpenChange}>
      <SheetContent className="sm:min-w-[50%] rounded-tl-[20px] rounded-bl-[20px] overflow-auto pb-0">
        <SheetHeader>
          <SheetTitle>Customer Details</SheetTitle>
          <SheetClose />
        </SheetHeader>
        <Card className="mt-8">
          <CardHeader className="flex flex-row items-center">
            <Image
              width={80}
              height={80}
              src={`https://i.pravatar.cc/80?u=${customer.email}`}
              alt={customer.name}
              className="w-24 h-24 rounded-full mr-4 shadow-sm"
            />
            <p className="text-xl font-semibold">{customer.name}</p>
          </CardHeader>
          <Separator />
          <CardContent>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              {customerInfo.map(({ icon, label, value, className }) => (
                <CustomerInfoItem
                  key={label}
                  icon={icon}
                  label={label}
                  value={<span className={className}>{value}</span>}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </SheetContent>
    </Sheet>
  );
};

export default React.memo(CustomerDetailSheet);