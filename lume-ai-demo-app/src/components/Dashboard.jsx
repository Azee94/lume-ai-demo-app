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
import { Search, Eye, Mail, Phone } from "lucide-react";
import { FixedSizeList as List } from "react-window";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Import the data
import testData from "@/data/test_dataset.json";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [listHeight, setListHeight] = useState(400);
  const containerRef = useRef(null);

  const filteredData = testData.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
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

  const Row = useCallback(
    ({ index, style }) => {
      const member = filteredData[index];
      return (
        <TableRow key={member.id} style={style}>
          <TableCell className="font-medium">
            <div className="flex items-center">
              <img
                src={`https://i.pravatar.cc/40?u=${member.email}`}
                alt={member.name}
                className="w-10 h-10 rounded-full mr-4"
              />
              <div>
                <div>{member.name}</div>
                <div className="text-sm text-gray-500">{member.id}</div>
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2 text-gray-400" />
              <span className="text-sm">{member.email}</span>
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-2 text-gray-400" />
              <span className="text-sm">{member.phone}</span>
            </div>
          </TableCell>
          <TableCell className="text-center">
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                member.gender.toLowerCase() === "male"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-pink-100 text-pink-800"
              }`}
            >
              {member.gender}
            </span>
          </TableCell>
          <TableCell className="text-right">
            <Button
              variant="outline"
              size="sm"
              className="inline-flex items-center"
            >
              <Eye className="w-4 h-4 mr-1" /> View
            </Button>
          </TableCell>
        </TableRow>
      );
    },
    [filteredData]
  );

  const innerElementType = React.useMemo(
    () =>
      React.forwardRef(({ style, ...rest }, ref) => (
        <Table ref={ref} {...rest} style={{ ...style }}>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Member</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Mobile Number</TableHead>
              <TableHead className="text-center">Gender</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{rest.children}</TableBody>
        </Table>
      )),
    []
  );
  //   const memoizedRows = useMemo(
  //     () => filteredData.map((member) => <Row key={member.id} member={member} />),
  //     [filteredData, Row]
  //   );

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

      <div className="overflow-hidden">
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
    </div>
  );
};

export default Dashboard;
