"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  VideoCallInfo,
  WorkoutInfo,
  RestaurantInfo,
  MedicalInfo,
  DevelopmentInfo,
  DesignInfo,
  WorkshopInfo,
} from "./types";

export function VideoCallDialog({ videoCall }: { videoCall: VideoCallInfo }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 hover:text-blue-600 dark:bg-blue-500/5 dark:text-blue-400 dark:hover:bg-blue-500/10"
        >
          Join Meeting
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{videoCall.platform} Meeting</DialogTitle>
          <DialogDescription>
            Join the meeting using the details below
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <div className="text-foreground text-sm font-medium">
              Meeting ID
            </div>
            <code className="bg-muted text-muted-foreground rounded px-2 py-1 text-sm">
              {videoCall.meetingId}
            </code>
          </div>
          <div className="space-y-2">
            <div className="text-foreground text-sm font-medium">Passcode</div>
            <code className="bg-muted text-muted-foreground rounded px-2 py-1 text-sm">
              {videoCall.passcode}
            </code>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={() => window.open(videoCall.link, "_blank")}
          >
            Join Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function WorkoutDialog({ workout }: { workout: WorkoutInfo }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 hover:text-emerald-600 dark:bg-emerald-500/5 dark:text-emerald-400 dark:hover:bg-emerald-500/10"
        >
          View Workout Details
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{workout.type} Workout</DialogTitle>
          <DialogDescription>
            {workout.level} • {workout.location}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {workout.exercises && (
            <div className="space-y-2">
              <div className="text-foreground text-sm font-medium">
                Exercises
              </div>
              <div className="grid gap-2">
                {workout.exercises.map((exercise, index) => (
                  <div
                    key={index}
                    className="border-border bg-card rounded-lg border p-3"
                  >
                    <div className="text-foreground font-medium">
                      {exercise.name}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {exercise.sets} sets × {exercise.reps}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {workout.training && (
            <div className="space-y-2">
              <div className="text-foreground text-sm font-medium">
                Training Plan
              </div>
              <div className="border-border bg-card rounded-lg border p-3">
                <div className="text-foreground">
                  Week {workout.training.week}
                </div>
                <div className="text-muted-foreground text-sm">
                  Goal: {workout.training.goal}
                </div>
                <div className="text-primary mt-2 text-sm">
                  Next: {workout.training.nextMilestone}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function RestaurantDialog({
  restaurant,
}: {
  restaurant: RestaurantInfo;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 hover:text-amber-600 dark:bg-amber-500/5 dark:text-amber-400 dark:hover:bg-amber-500/10"
        >
          View Restaurant Details
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{restaurant.name}</DialogTitle>
          <DialogDescription>{restaurant.address}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <div className="text-foreground text-sm font-medium">
              Reservation
            </div>
            <div className="border-border bg-card rounded-lg border p-3">
              <div className="text-foreground">
                Time: {restaurant.reservation.time}
              </div>
              <div className="text-muted-foreground text-sm">
                Party of {restaurant.reservation.partySize}
              </div>
              <div className="text-muted-foreground mt-2 font-mono text-sm">
                Confirmation: {restaurant.reservation.confirmation}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-foreground text-sm font-medium">
              Dietary Options
            </div>
            <div className="flex flex-wrap gap-2">
              {restaurant.dietaryOptions.map((option, index) => (
                <span
                  key={index}
                  className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm"
                >
                  {option}
                </span>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => window.open(restaurant.menu, "_blank")}>
            View Menu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function MedicalDialog({ medical }: { medical: MedicalInfo }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 hover:text-rose-600 dark:bg-rose-500/5 dark:text-rose-400 dark:hover:bg-rose-500/10"
        >
          View Appointment Details
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Appointment with {medical.doctor}</DialogTitle>
          <DialogDescription>{medical.specialty}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <div className="text-foreground text-sm font-medium">Location</div>
            <div className="border-border bg-card rounded-lg border p-3">
              <div className="text-foreground">{medical.clinic}</div>
              <div className="text-muted-foreground text-sm">
                {medical.address}
              </div>
              <div className="text-muted-foreground text-sm">
                {medical.floor}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-foreground text-sm font-medium">
              Required Documents
            </div>
            <div className="flex flex-col gap-2">
              {medical.documents.map((doc, index) => (
                <div
                  key={index}
                  className="border-border bg-card rounded-lg border p-2 text-sm"
                >
                  <span className="text-muted-foreground">• {doc}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-foreground text-sm font-medium">
              Additional Information
            </div>
            <div className="border-border bg-card rounded-lg border p-3">
              <div className="text-foreground">
                Insurance: {medical.insurance}
              </div>
              <div className="text-muted-foreground mt-2 text-sm">
                {medical.parking}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function DevelopmentDialog({
  development,
}: {
  development: DevelopmentInfo;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full bg-violet-500/10 text-violet-500 hover:bg-violet-500/20 hover:text-violet-600 dark:bg-violet-500/5 dark:text-violet-400 dark:hover:bg-violet-500/10"
        >
          View Development Details
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Code Review</DialogTitle>
          <DialogDescription>
            Pull Request {development.pullRequest}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <div className="text-foreground text-sm font-medium">
              Repository
            </div>
            <div className="border-border bg-card rounded-lg border p-3">
              <div className="text-foreground font-mono text-sm">
                {development.repository}
              </div>
              <div className="text-muted-foreground mt-2 text-sm">
                Environment: {development.deployment.environment}
              </div>
              <div className="text-muted-foreground mt-1 text-sm">
                Version: {development.deployment.version}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-foreground text-sm font-medium">Changes</div>
            <div className="flex flex-col gap-2">
              {development.changes.map((change, index) => (
                <div
                  key={index}
                  className="border-border bg-card rounded-lg border p-2 text-sm"
                >
                  <span className="text-muted-foreground">• {change}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-foreground text-sm font-medium">Reviewers</div>
            <div className="flex flex-wrap gap-2">
              {development.reviewers.map((reviewer, index) => (
                <span
                  key={index}
                  className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm"
                >
                  {reviewer}
                </span>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <div className="flex w-full items-center justify-between">
            <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm">
              {development.testCoverage} Coverage
            </span>
            <Button
              onClick={() =>
                window.open(`https://${development.repository}`, "_blank")
              }
            >
              View Repository
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function DesignDialog({ design }: { design: DesignInfo }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full bg-fuchsia-500/10 text-fuchsia-500 hover:bg-fuchsia-500/20 hover:text-fuchsia-600 dark:bg-fuchsia-500/5 dark:text-fuchsia-400 dark:hover:bg-fuchsia-500/10"
        >
          View Design Details
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{design.project}</DialogTitle>
          <DialogDescription>Design Review</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <div className="text-foreground text-sm font-medium">Files</div>
            <div className="flex flex-col gap-2">
              {design.files.map((file, index) => (
                <div
                  key={index}
                  className="border-border bg-card rounded-lg border p-2 text-sm"
                >
                  <span className="text-muted-foreground">• {file}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-foreground text-sm font-medium">Tools</div>
            <div className="flex flex-wrap gap-2">
              {design.tools.map((tool, index) => (
                <span
                  key={index}
                  className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-foreground text-sm font-medium">
              Research Results
            </div>
            <div className="border-border bg-card rounded-lg border p-3">
              <div className="text-foreground flex items-center gap-2">
                <span>✨</span>
                <span>Usability: {design.research.usability}</span>
              </div>
              <div className="text-foreground mt-2 flex items-center gap-2">
                <span>♿️</span>
                <span>Accessibility: {design.research.accessibility}</span>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => window.open(`https://${design.prototype}`, "_blank")}
          >
            View Prototype
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function WorkshopDialog({ workshop }: { workshop: WorkshopInfo }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20 hover:text-cyan-600 dark:bg-cyan-500/5 dark:text-cyan-400 dark:hover:bg-cyan-500/10"
        >
          View Workshop Details
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Workshop Materials</DialogTitle>
          <DialogDescription>
            {workshop.facilitator
              ? `Facilitated by ${workshop.facilitator}`
              : "Workshop Details"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <div className="text-foreground text-sm font-medium">
              Required Materials
            </div>
            <div className="flex flex-col gap-2">
              {workshop.materials.map((material, index) => (
                <div
                  key={index}
                  className="border-border bg-card rounded-lg border p-2 text-sm"
                >
                  <span className="text-muted-foreground">• {material}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-foreground text-sm font-medium">
              Prerequisites
            </div>
            <div className="flex flex-col gap-2">
              {workshop.prerequisites.map((prereq, index) => (
                <div
                  key={index}
                  className="border-border bg-card rounded-lg border p-2 text-sm"
                >
                  <span className="text-muted-foreground">• {prereq}</span>
                </div>
              ))}
            </div>
          </div>
          {workshop.tools && (
            <div className="space-y-2">
              <div className="text-foreground text-sm font-medium">Tools</div>
              <div className="flex flex-wrap gap-2">
                {workshop.tools.map((tool, index) => (
                  <span
                    key={index}
                    className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            onClick={() =>
              window.open(`https://${workshop.repository}`, "_blank")
            }
          >
            View Repository
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
