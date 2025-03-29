
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const salesData = [
  { name: 'Pradeep', sales: 156, conversion: 5.8 },
  { name: 'Amita', sales: 134, conversion: 4.9 },
  { name: 'Vikram', sales: 128, conversion: 4.7 },
  { name: 'Nisha', sales: 115, conversion: 4.2 },
  { name: 'Rajesh', sales: 102, conversion: 3.8 },
];

const SalesTeamTable = () => {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">Sales Team</CardTitle>
        <Button variant="ghost" size="sm" className="text-swiggy-orange">
          View All
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead className="text-right">Sales</TableHead>
              <TableHead className="text-right">Conversion</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salesData.map((item) => (
              <TableRow key={item.name}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-right">{item.sales}</TableCell>
                <TableCell className="text-right">{item.conversion}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SalesTeamTable;
