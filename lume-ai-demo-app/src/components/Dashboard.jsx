"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Eye, Mail, Phone } from "lucide-react";
import { FixedSizeList as List } from "react-window";

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
        <tr key={member.id} style={style}>
          <td className="border-b border-gray-200 py-4">
            <div className="flex items-center">
              <img
                src={`https://i.pravatar.cc/40?u=${member.email}`}
                alt={member.name}
                className="w-10 h-10 rounded-full mr-4"
              />
              <div>
                <div className="font-medium">{member.name}</div>
                <div className="text-sm text-gray-500">{member.id}</div>
              </div>
            </div>
          </td>
          <td className="border-b border-gray-200 py-4">
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2 text-gray-400" aria-hidden="true" />
              <span className="text-sm">{member.email}</span>
            </div>
          </td>
          <td className="border-b border-gray-200 py-4">
            <div className="flex items-center">
              <Phone
                className="w-4 h-4 mr-2 text-gray-400"
                aria-hidden="true"
              />
              <span className="text-sm">{member.phone}</span>
            </div>
          </td>
          <td className="border-b border-gray-200 py-4 text-center">
            <span
              className={`px-2 py-1 rounded-full text-xs capitalize ${
                member.gender.toLowerCase() === "male"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-pink-100 text-pink-800"
              }`}
            >
              {member.gender}
            </span>
          </td>
          <td className="border-b border-gray-200 py-4 text-right">
            <Button
              variant="outline"
              size="sm"
              className="inline-flex items-center"
            >
              <Eye className="w-4 h-4 mr-1" aria-hidden="true" />
              <span>View</span>
            </Button>
          </td>
        </tr>
      );
    },
    [filteredData]
  );

  const innerElementType = React.useMemo(
    () =>
      React.forwardRef(({ style, ...rest }, ref) => (
        <table className="min-w-full" ref={ref} {...rest} style={{ ...style }}>
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Member
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Mobile Number
              </th>
              <th className="px-6 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Gender
              </th>
              <th className="px-6 py-3 bg-gray-50 text-right text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>{rest.children}</tbody>
        </table>
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
