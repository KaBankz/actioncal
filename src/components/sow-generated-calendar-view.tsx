/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface GeneratedUIProps {
  calendarData: {
    events: Array<{
      title: string;
      startTime: string;
      endTime: string;
      type?: string;
      notes?: string;
    }>;
    preferences?: {
      focusHours?: string[];
      breakPreferences?: {
        frequency: number;
        duration: number;
      };
    };
  };
  generatedComponents: {
    layout: string;
    components: Array<{
      type: string;
      props: {
        title: string;
        description: string;
        detailedNotes: string;
        priority: "high" | "medium" | "low";
        actionItems: string[];
        relatedEventId: string;
        timeBlock: { start: string; end: string };
      };
    }>;
    suggestions: {
      schedule_adjustments: string[];
      focus_recommendations: string[];
      meeting_preparations: string[];
    };
  };
}

export function GeneratedCalendarView({
  calendarData,
  generatedComponents,
}: GeneratedUIProps) {
  if (!generatedComponents) {
    return null;
  }

  // Sort all components by their timeBlock.start
  const sortedComponents = [...generatedComponents.components].sort((a, b) => {
    const aTime = new Date(a.props.timeBlock?.start || "").getTime();
    const bTime = new Date(b.props.timeBlock?.start || "").getTime();
    return aTime - bTime;
  });

  // State to track which component cards are expanded
  const [expandedIndices, setExpandedIndices] = useState<number[]>([]);

  const toggleExpand = (index: number) => {
    setExpandedIndices((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  // Helper function to format time
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="space-y-8">
      {/* Timeline of Components */}
      <div className="space-y-4">
        {sortedComponents.map((component, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative cursor-pointer"
            onClick={() => toggleExpand(index)}
          >
            {/* Time indicator */}
            <div className="absolute left-0 top-6 w-24 text-sm text-gray-500">
              {formatTime(component.props.timeBlock?.start)}
            </div>

            {/* Component content */}
            <div className="bg-card border-border ml-28 rounded-lg border p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-primary mb-2 text-lg font-semibold">
                    {component.props.title}
                  </div>
                  <div className="text-muted-foreground mb-4">
                    {component.props.description}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {formatTime(component.props.timeBlock?.start)} -{" "}
                  {formatTime(component.props.timeBlock?.end)}
                </div>
              </div>

              {/* Action Items */}
              <ul className="space-y-2">
                {component.props.actionItems?.map(
                  (item: string, itemIndex: number) => (
                    <li key={itemIndex} className="flex items-center gap-2">
                      <svg
                        className="text-primary h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        {component.type === "MeetingPrep" ? (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        ) : (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        )}
                      </svg>
                      {item}
                    </li>
                  )
                )}
              </ul>

              {/* Detailed Notes (toggle visibility on click) */}
              {expandedIndices.includes(index) && (
                <div className="mt-4 rounded bg-gray-50 p-4 border">
                  <h4 className="mb-2 font-semibold">Detailed Notes</h4>
                  <p className="text-sm text-gray-700">
                    {component.props.detailedNotes || "No additional details provided."}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-muted rounded-lg p-6"
      >
        <h3 className="mb-4 text-xl font-semibold">AI Recommendations</h3>
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <h4 className="text-primary mb-2 font-medium">
              Schedule Adjustments
            </h4>
            <ul className="text-muted-foreground space-y-2">
              {generatedComponents.suggestions.schedule_adjustments.map(
                (suggestion, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="text-primary">•</span>
                    {suggestion}
                  </li>
                )
              )}
            </ul>
          </div>
          <div>
            <h4 className="text-primary mb-2 font-medium">
              Focus Recommendations
            </h4>
            <ul className="text-muted-foreground space-y-2">
              {generatedComponents.suggestions.focus_recommendations.map(
                (recommendation, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="text-primary">•</span>
                    {recommendation}
                  </li>
                )
              )}
            </ul>
          </div>
          <div>
            <h4 className="text-primary mb-2 font-medium">
              Meeting Preparations
            </h4>
            <ul className="text-muted-foreground space-y-2">
              {generatedComponents.suggestions.meeting_preparations.map(
                (prep, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="text-primary">•</span>
                    {prep}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
