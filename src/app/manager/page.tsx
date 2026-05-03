
"use client";

import { useInventory } from '../lib/store';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  CheckSquare, 
  AlertCircle, 
  Clock, 
  Coffee, 
  UserPlus,
  ClipboardList,
  MoreVertical,
  Activity,
  UserCheck,
  Mail
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';

export default function ManagerPage() {
  const { staff, tasks, toggleTask } = useInventory();
  const { toast } = useToast();

  const activeStaffCount = staff.filter(s => s.status === 'active').length;
  const pendingTasksCount = tasks.filter(t => !t.completed).length;

  const handleGetStaffRequest = () => {
    toast({
      title: "Staff Request Received",
      description: "Our human resource team will attend to your request within 24 hours.",
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-headline font-bold">Manager Control Center</h1>
          <p className="text-muted-foreground">Oversee kitchen operations, staff, and daily checklists.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="rounded-xl border-primary/20 text-primary h-11 px-6 shadow-sm">
                <UserCheck className="mr-2 h-4 w-4" />
                Get Staff
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-headline font-bold">Recruitment Support</DialogTitle>
                <DialogDescription className="text-base pt-2 leading-relaxed">
                  Hit our get a staff button whenever you are short of kitchen staff, and our human resource team will attend to you within 24 hours.
                  <br /><br />
                  For direct inquiries, contact us at: <span className="font-bold text-primary">kitchenprof@gmail.com</span>
                  <br /><br />
                  <span className="font-bold text-destructive">NOTE:</span> This option is only available to businesses within Nigeria for now.
                </DialogDescription>
              </DialogHeader>
              <div className="pt-6">
                <Button 
                  className="w-full bg-primary h-12 text-lg shadow-lg"
                  onClick={handleGetStaffRequest}
                >
                  Confirm Staff Request
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" className="rounded-xl border-primary/20 text-primary h-11 px-6">
            <ClipboardList className="mr-2 h-4 w-4" />
            Duty Roster
          </Button>
          <Button className="bg-primary hover:bg-primary/90 rounded-xl h-11 px-6 shadow-md">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Staff
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-md bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Staff Present</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeStaffCount} / {staff.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently on duty</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical Tasks</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasksCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Pending items on checklist</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Kitchen Pulse</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Optimal</div>
            <p className="text-xs text-muted-foreground mt-1">Status based on performance</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="text-primary" size={20} />
              Manager's Daily Checklist
            </CardTitle>
            <CardDescription>Verify operations for the current shift.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-accent/20 hover:bg-accent/5 transition-all">
                <div className="flex items-center gap-3">
                  <Checkbox 
                    id={task.id} 
                    checked={task.completed} 
                    onCheckedChange={() => toggleTask(task.id)}
                  />
                  <label 
                    htmlFor={task.id} 
                    className={`text-sm font-medium ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}
                  >
                    {task.task}
                  </label>
                </div>
                <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'} className="text-[10px] h-5">
                  {task.priority}
                </Badge>
              </div>
            ))}
          </CardContent>
          <CardFooter className="border-t bg-muted/20 p-4">
            <p className="text-xs text-muted-foreground italic">Last update sync: Today, 8:45 AM</p>
          </CardFooter>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="text-primary" size={20} />
              Staff Status
            </CardTitle>
            <CardDescription>Monitor who is currently handling the kitchen.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {staff.map((member) => (
                <div key={member.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/30 flex items-center justify-center text-primary font-bold text-xs">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{member.name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">{member.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {member.status === 'active' ? (
                      <Badge className="bg-green-500 hover:bg-green-600 text-[10px] h-5">
                        <Clock className="w-3 h-3 mr-1" /> ACTIVE
                      </Badge>
                    ) : member.status === 'on-break' ? (
                      <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-200 text-[10px] h-5">
                        <Coffee className="w-3 h-3 mr-1" /> ON BREAK
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground text-[10px] h-5">
                        OFF DUTY
                      </Badge>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <MoreVertical size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
