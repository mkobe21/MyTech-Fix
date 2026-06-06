'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BusinessOnboardingProps {
  onComplete: (data: any) => void;
}

export default function BusinessOnboarding({ onComplete }: BusinessOnboardingProps) {
  const [formData, setFormData] = useState({
    companyName: '',
    numberOfEmployees: '',
    locations: '',
    mainPainPoints: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label>Company Name</Label>
        <Input
          required
          value={formData.companyName}
          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          placeholder="Acme Corp"
        />
      </div>

      <div>
        <Label>Number of Employees</Label>
        <Input
          type="number"
          value={formData.numberOfEmployees}
          onChange={(e) => setFormData({ ...formData, numberOfEmployees: e.target.value })}
          placeholder="12"
        />
      </div>

      <div>
        <Label>Number of Locations</Label>
        <Input
          value={formData.locations}
          onChange={(e) => setFormData({ ...formData, locations: e.target.value })}
          placeholder="1 (Main Office)"
        />
      </div>

      <div>
        <Label>What are your biggest tech pain points?</Label>
        <textarea
          className="w-full border rounded-xl p-3 min-h-[100px]"
          value={formData.mainPainPoints}
          onChange={(e) => setFormData({ ...formData, mainPainPoints: e.target.value })}
          placeholder="WiFi dropping, printer issues, new employee laptop setup..."
        />
      </div>

      <Button type="submit" className="w-full">
        Continue to Account Creation
      </Button>
    </form>
  );
}
