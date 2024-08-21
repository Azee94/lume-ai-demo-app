"use client";

import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Eye, Mail, Phone, UsersIcon } from "lucide-react";
import { FixedSizeList as List } from "react-window";

import CustomerDetailSheet from '@/components/CustomerDetailModal';
// Import the data
import testData from "@/data/test_dataset.json";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [listHeight, setListHeight] = useState(400);
  const containerRef = useRef(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const filteredData = testData.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateListHeight = useCallback(() => {
    if (containerRef.current) {
      const windowHeight = window.innerHeight;
      const containerTop = containerRef.current.getBoundingClientRect().top;
      const newHeight = windowHeight - containerTop - 40; // 40px for some bottom margin
      setListHeight(Math.max(200, newHeight)); // Ensure a minimum height of 200px
    }
  }, []);

  useEffect(() => {
    updateListHeight();
    window.addEventListener("resize", updateListHeight);
    return () => window.removeEventListener("resize", updateListHeight);
  }, [updateListHeight]);

  const handleViewCustomer = (customer) => {
    console.log('customer', customer)
    setSelectedCustomer(customer);
    setIsSheetOpen(true);
  };

const handleCloseSheet = () => {
    setIsSheetOpen(false);
    setSelectedCustomer(null);
};
const Row = useCallback(
    ({ index, style }) => {
      const member = filteredData[index];
      const isMale = member.gender.toLowerCase() === "male";
      return (
        <div
          style={{
            ...style,
            display: "flex",
            alignItems: "center",
            padding: "12px 16px",
            borderBottom: "1px solid #e2e8f0",
          }}
          key={member.id}
        >
          <div style={{ display: "flex", alignItems: "center", width: "30%" }}>
            <img
              src={`https://i.pravatar.cc/40?u=${member.email}`}
              alt={member.name}
              className="w-10 h-10 rounded-full mr-4"
            />
            <div>
              <div className="font-medium">{member.name}</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", width: "30%" }}>
            <Mail className="w-4 h-4 mr-2 text-gray-400" />
            <span className="text-sm">{member.email}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", width: "20%" }}>
            <Phone className="w-4 h-4 mr-2 text-gray-400" />
            <span className="text-sm">{member.phone}</span>
          </div>
          <div style={{ width: "10%", textAlign: "center" }}>
            <span
              className={`px-2 py-1 rounded-full text-xs flex items-center justify-center ${
                isMale
                  ? "bg-blue-100 text-blue-800"
                  : "bg-pink-100 text-pink-800"
              }`}
            >
                <UsersIcon className="w-4 h-4 mr-1" />
              {member.gender}
            </span>
          </div>
          <div style={{ width: "10%", textAlign: "right" }}>
            <Button
              variant="outline"
              size="sm"
              className="inline-flex items-center"
              onClick={() => handleViewCustomer(member)}
            >
              <Eye className="w-4 h-4 mr-1" /> View
            </Button>
          </div>
        </div>
      );
    },
    [filteredData, handleViewCustomer]
  );

  const innerElementType = useMemo(
    () =>
      React.forwardRef(({ style, ...rest }, ref) => (
        <div ref={ref} style={{ ...style, height: '100%', overflow: 'auto' }}>
          {/* <div style={{display: 'flex', padding: '12px 16px', borderBottom: '1px solid #e2e8f0', fontWeight: 'bold', backgroundColor: '#f8fafc'}}>
            <div style={{width: '30%'}}>Member</div>
            <div style={{width: '30%'}}>Email</div>
            <div style={{width: '20%'}}>Mobile Number</div>
            <div style={{width: '10%', textAlign: 'center'}}>Gender</div>
            <div style={{width: '10%', textAlign: 'right'}}>Actions</div>
          </div> */}
          {rest.children}
        </div>
      )),
    []
  );
  
  return (
    <div className="container mx-auto p-6" ref={containerRef}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Team Members</h1>
          <span className="text-gray-500">{filteredData.length}</span>
        </div>
        <div className="flex items-center">
          <div className="relative mr-4">
            <Search
              className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
            <Input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 rounded-full border border-gray-300"
              aria-label="Search team members"
            />
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 py-2">
            Add{" "}
            <span className="ml-1" aria-hidden="true">
              +
            </span>
          </Button>
        </div>
      </div>

      <div className="overflow-hidden border rounded-lg" style={{ height: listHeight + 40, position: 'relative' }}>
      <div style={{
          display: 'flex',
          padding: '12px 16px',
          borderBottom: '1px solid #e2e8f0',
          fontWeight: 'bold',
          backgroundColor: '#f8fafc',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <div style={{width: '30%'}}>Member</div>
          <div style={{width: '30%'}}>Email</div>
          <div style={{width: '20%'}}>Mobile Number</div>
          <div style={{width: '10%', textAlign: 'center'}}>Gender</div>
          <div style={{width: '10%', textAlign: 'right'}}>Actions</div>
        </div>
        <List
          height={listHeight}
          itemCount={filteredData.length}
          itemSize={80}
          width="100%"
          innerElementType={innerElementType}
        >
          {Row}
        </List>
      </div>
      {selectedCustomer &&
      <CustomerDetailSheet
        isOpen={isSheetOpen}
        onClose={handleCloseSheet}
        customer={selectedCustomer}
      />}
    </div>
  );
};

export default Dashboard;
