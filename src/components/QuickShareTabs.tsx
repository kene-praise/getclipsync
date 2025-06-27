
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import QuickShareForm from './QuickShareForm';
import ReceiveClipPanel from './ReceiveClipPanel';

const QuickShareTabs = () => {
  return (
    <div className="w-full max-w-md mx-auto">
      <Tabs defaultValue="share" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="share">Share</TabsTrigger>
          <TabsTrigger value="receive">Receive</TabsTrigger>
        </TabsList>
        <TabsContent value="share">
          <QuickShareForm />
        </TabsContent>
        <TabsContent value="receive">
          <ReceiveClipPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuickShareTabs;
