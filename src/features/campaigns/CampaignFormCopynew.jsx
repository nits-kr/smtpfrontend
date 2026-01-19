import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { toast } from "react-toastify";
import {
  FiCheck,
  FiChevronRight,
  FiChevronLeft,
  FiUpload,
  FiCode,
  FiEye,
  FiSettings,
  FiSend,
  FiSearch,
  FiDownload,
} from "react-icons/fi";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";
import { useCreateCampaignMutation } from "./campaignsApi";
import RichTextEditor from "./RichTextEditor";
import "./quill.css";

// Preview Modal Component with Glass Effect
const PreviewModal = ({ isOpen, onClose, content, contentType }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Glass effect background */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-white/20">
        {/* Modal header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-gray-800">Email Preview</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <span className="sr-only">Close</span>
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal body */}
        <div className="overflow-y-auto p-6 max-h-[calc(90vh-120px)] bg-gradient-to-br from-gray-50/80 to-blue-50/30">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 min-h-[400px]">
            {contentType === "html" ? (
              <div
                className="email-preview"
                dangerouslySetInnerHTML={{
                  __html: content || "<p>No content to preview</p>",
                }}
              />
            ) : contentType === "plain" ? (
              <pre className="whitespace-pre-wrap font-sans text-gray-800">
                {content || "No content to preview"}
              </pre>
            ) : contentType === "mime" ? (
              <div className="font-mono text-sm bg-gray-50 p-4 rounded border">
                <pre className="whitespace-pre-wrap text-gray-800">
                  {content || "No MIME content to preview"}
                </pre>
              </div>
            ) : (
              <div className="text-gray-500 italic">
                Select an email format to preview
              </div>
            )}
          </div>
        </div>

        {/* Modal footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-white/90 backdrop-blur-sm">
          <div className="text-sm text-gray-600">
            Previewing as:{" "}
            <span className="font-medium capitalize">{contentType}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};

const CampaignForm = () => {
  const navigate = useNavigate();
  const [createCampaign, { isLoading }] = useCreateCampaignMutation();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSpaceSending, setShowSpaceSending] = useState(false);
  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    content: "",
    contentType: "plain",
  });
  const [showEditor, setShowEditor] = useState(false);

  // Add the missing stats state
  const [stats, setStats] = useState({
    total: 0,
    valid: 0,
    invalid: 0,
    duplicates: 0,
  });

  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      template: "",
      recipientsText: "",
      recipientStats: { total: 0, valid: 0, invalid: 0, duplicates: 0 },
      senderName: "",
      senderNameEncoding: "reset",
      fromEmail: "",
      replyTo: "",
      subject: "",
      subjectEncoding: "reset",
      encoding: "UTF-8",
      transferEncoding: "8bit",
      customHeaders: "",
      contentType: "plain",
      body: "",
      mimeMessage: "",
      scheduleDate: "",
      throttle: 100,

      // Settings dropdown fields
      dataFile: "",
      totalSend: 0,
      limitToSend: 0,
      sleepTime: 0,
      offerId: "",
      templateName: "",
      domain: "",
      waitTime: 0,
      messageId: "",
      replyToSetting: "",
      xmailer: "",
      replyToEnabled: "no",

      // Space Sending dropdown fields
      spaceSendingEnabled: false,
      spaceLimitToSend: 0,
      spaceSleepTime: 0,
      spaceOfferId: "",
      spaceTemplateName: "",
      spaceDomain: "",
      spaceWaitTime: 0,
      spaceMessageId: "",
      spaceReplyTo: "",
      spaceXmailer: "",
      spaceXmailer2: "",
      spaceSending: "no",
    },
  });

  const {
    register,
    watch,
    setValue,
    formState: { errors },
    trigger,
    handleSubmit,
  } = methods;
  const recipientsText = watch("recipientsText");
  const contentType = watch("contentType");
  const encoding = watch("encoding");
  const body = watch("body");
  const values = watch();

  // Recipients stats calculation
  useEffect(() => {
    if (!recipientsText) {
      setStats({ total: 0, valid: 0, invalid: 0, duplicates: 0 });
      return;
    }

    const lines = recipientsText
      .split(/[\n,;]+/)
      .map((l) => l.trim())
      .filter(Boolean);
    const total = lines.length;
    const unique = new Set(lines);
    const duplicates = total - unique.size;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let valid = 0;
    let invalid = 0;

    unique.forEach((line) => {
      const parts = line.split(":");
      const email = parts.length > 1 ? parts[1] : parts[0];
      if (emailRegex.test(email)) valid++;
      else invalid++;
    });

    const newStats = { total, valid, invalid, duplicates };
    setStats(newStats);
    setValue("recipientStats", newStats, { shouldValidate: true });
  }, [recipientsText, setValue]);

  // File upload handler
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setValue("recipientsText", event.target.result || "", {
        shouldValidate: true,
      });
    };
    reader.readAsText(file);
  };

  const onSubmit = async (data) => {
    try {
      await createCampaign(data).unwrap();
      toast.success("Campaign created successfully!");
      navigate("/campaigns");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create campaign. Please try again.");
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Create New Campaign
          </h1>
          <p className="text-gray-600">Design and launch your email campaign</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Campaign Search at Top - Full Width */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm mb-6">
            <div className="flex items-end gap-2">
              <div className="flex-grow">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Campaign Search...
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search campaigns..."
                />
              </div>
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors border border-blue-700 h-[42px]"
              >
                Load
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Campaign Setup & Recipients */}
            <div className="lg:col-span-1 space-y-6">
              {/* Campaign Setup */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Campaign Setup
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Campaign Template
                    </label>
                    <select
                      {...register("template")}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">None</option>
                      <option value="pptrom-email">PPTrom-Email</option>
                      <option value="newsletter">Newsletter Template</option>
                      <option value="promotional">Promotional Template</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Campaign Name *
                    </label>
                    <Input
                      {...register("name", {
                        required: "Campaign Name is required",
                      })}
                      error={errors.name}
                      placeholder="e.g. Monthly Newsletter - Jan 2026"
                      className="border-gray-300 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description (Optional)
                    </label>
                    <textarea
                      {...register("description")}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
                      placeholder="Internal reference notes..."
                    />
                  </div>
                </div>
              </div>

              {/* Recipients Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Add Recipients
                </h2>

                <input
                  type="hidden"
                  {...register("recipientStats", {
                    validate: (value) =>
                      (value && value.valid > 0) ||
                      "Please add at least one valid recipient",
                  })}
                />

                {errors.recipientStats && (
                  <p className="text-red-600 text-sm font-bold bg-red-50 p-2 rounded mb-3">
                    {errors.recipientStats.message}
                  </p>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-blue-50 p-3 rounded border border-blue-100">
                    <div className="text-xs text-blue-600">Total Lines</div>
                    <div className="text-xl font-bold text-blue-700">
                      {stats.total}
                    </div>
                  </div>
                  <div className="bg-green-50 p-3 rounded border border-green-100">
                    <div className="text-xs text-green-600">Valid Emails</div>
                    <div className="text-xl font-bold text-green-700">
                      {stats.valid}
                    </div>
                  </div>
                  <div className="bg-red-50 p-3 rounded border border-red-100">
                    <div className="text-xs text-red-600">Invalid</div>
                    <div className="text-xl font-bold text-red-700">
                      {stats.invalid}
                    </div>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded border border-yellow-100">
                    <div className="text-xs text-yellow-600">Duplicates</div>
                    <div className="text-xl font-bold text-yellow-700">
                      {stats.duplicates}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Paste Emails or IPs (One per line or comma/semicolon
                    separated)
                  </label>
                  <textarea
                    {...register("recipientsText", {
                      required: "Please enter recipients",
                    })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-48"
                    placeholder="user@example.com&#10;192.168.1.1:admin@test.com&#10;another@domain.com"
                  />
                  {errors.recipientsText && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.recipientsText.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <div className="relative">
                    <input
                      type="file"
                      id="csvUpload"
                      className="hidden"
                      accept=".csv,.txt"
                      onChange={handleFileUpload}
                    />
                    <label
                      htmlFor="csvUpload"
                      className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded cursor-pointer transition-colors border border-gray-300 text-sm"
                    >
                      <FiUpload className="w-4 h-4" />
                      Upload Text/CSV
                    </label>
                  </div>

                  <button
                    type="button"
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors border border-gray-300 text-sm"
                    onClick={() => {
                      setValue("recipientsText", "");
                    }}
                  >
                    Clear All
                  </button>

                  <button
                    type="button"
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors border border-gray-300 text-sm"
                    onClick={() => {
                      setValue(
                        "recipientsText",
                        "test1@example.com\ntest2@domain.com\n192.168.1.1:admin@test.com"
                      );
                    }}
                  >
                    Load Sample
                  </button>
                </div>
              </div>
            </div>

            {/* Middle Column - Email Header & Content */}
            <div className="lg:col-span-1 space-y-6">
              {/* Additional Header - EXACT LAYOUT FROM PNG */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <h3 className="text-md font-semibold text-gray-800 mb-4">
                  Additional Header
                </h3>

                {/* From Email Address */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      From Email Address
                    </label>
                    <div className="flex gap-1">
                      <label className="flex items-center gap-1 px-3 py-1 bg-gray-100 border border-gray-300 rounded cursor-pointer">
                        <input
                          type="radio"
                          {...register("subjectEncoding")}
                          value="q"
                          className="accent-blue-600"
                        />
                        <span className="text-sm text-gray-700">UTF8-Q</span>
                      </label>
                      <label className="flex items-center gap-1 px-3 py-1 bg-gray-100 border border-gray-300 rounded cursor-pointer">
                        <input
                          type="radio"
                          {...register("subjectEncoding")}
                          value="b"
                          className="accent-blue-600"
                        />
                        <span className="text-sm text-gray-700">UTF8-B</span>
                      </label>
                      <label className="flex items-center gap-1 px-3 py-1 bg-gray-100 border border-gray-300 rounded cursor-pointer">
                        <input
                          type="radio"
                          {...register("subjectEncoding")}
                          value="reset"
                          className="accent-blue-600"
                          defaultChecked
                        />
                        <span className="text-sm text-gray-700">REST</span>
                      </label>
                    </div>
                  </div>
                  <Input
                    {...register("fromEmail", {
                      required: "From Email is required",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Please enter a valid email address",
                      },
                    })}
                    error={errors.fromEmail}
                    placeholder="Game@demo.com"
                    className="border-gray-300 focus:ring-blue-500"
                  />
                </div>

                {/* Subject */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Subject
                    </label>
                    <div className="flex gap-1">
                      <label className="flex items-center gap-1 px-3 py-1 bg-gray-100 border border-gray-300 rounded cursor-pointer">
                        <input
                          type="radio"
                          {...register("subjectEncoding")}
                          value="q"
                          className="accent-blue-600"
                        />
                        <span className="text-sm text-gray-700">UTF8-Q</span>
                      </label>
                      <label className="flex items-center gap-1 px-3 py-1 bg-gray-100 border border-gray-300 rounded cursor-pointer">
                        <input
                          type="radio"
                          {...register("subjectEncoding")}
                          value="b"
                          className="accent-blue-600"
                        />
                        <span className="text-sm text-gray-700">UTF8-B</span>
                      </label>
                      <label className="flex items-center gap-1 px-3 py-1 bg-gray-100 border border-gray-300 rounded cursor-pointer">
                        <input
                          type="radio"
                          {...register("subjectEncoding")}
                          value="reset"
                          className="accent-blue-600"
                          defaultChecked
                        />
                        <span className="text-sm text-gray-700">REST</span>
                      </label>
                    </div>
                  </div>
                  <Input
                    {...register("subject", {
                      required: "Subject is required",
                    })}
                    error={errors.subject}
                    placeholder="Enter subject"
                    className="border-gray-300 focus:ring-blue-500"
                  />
                </div>

                {/* From Name */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      From Name
                    </label>
                    <div className="flex gap-1">
                      <label className="flex items-center gap-1 px-3 py-1 bg-gray-100 border border-gray-300 rounded cursor-pointer">
                        <input
                          type="radio"
                          {...register("senderNameEncoding")}
                          value="q"
                          className="accent-blue-600"
                        />
                        <span className="text-sm text-gray-700">UTF8-Q</span>
                      </label>
                      <label className="flex items-center gap-1 px-3 py-1 bg-gray-100 border border-gray-300 rounded cursor-pointer">
                        <input
                          type="radio"
                          {...register("senderNameEncoding")}
                          value="b"
                          className="accent-blue-600"
                        />
                        <span className="text-sm text-gray-700">UTF8-B</span>
                      </label>
                      <label className="flex items-center gap-1 px-3 py-1 bg-gray-100 border border-gray-300 rounded cursor-pointer">
                        <input
                          type="radio"
                          {...register("senderNameEncoding")}
                          value="reset"
                          className="accent-blue-600"
                          defaultChecked
                        />
                        <span className="text-sm text-gray-700">REST</span>
                      </label>
                    </div>
                  </div>
                  <Input
                    {...register("senderName")}
                    placeholder="Enter sender name"
                    className="border-gray-300 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Email Format Buttons */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Format
                </label>
                <div className="flex flex-wrap gap-2">
                  {["Plain", "Html", "MIME", "Preview", "EDITOR"].map(
                    (type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          if (type === "Preview") {
                            // Open preview modal
                            setPreviewModal({
                              isOpen: true,
                              content: body,
                              contentType: contentType || "plain",
                            });
                          } else if (type === "EDITOR") {
                            setShowEditor(true);
                          } else {
                            setValue("contentType", type.toLowerCase());
                          }
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded border text-sm transition-colors ${
                          type === "Preview" || type === "EDITOR"
                            ? "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
                            : contentType === type.toLowerCase()
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
                        }`}
                      >
                        {type === "Preview" ? (
                          <FiEye className="w-4 h-4" />
                        ) : type === "EDITOR" ? (
                          <FiCode className="w-4 h-4" />
                        ) : null}
                        {type}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Message Content */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Message
                  </h2>
                  <div className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded border border-blue-100">
                    <span className="text-sm text-blue-700 font-medium">
                      UTF-8
                    </span>
                    <span className="text-sm text-blue-600">[Bait]</span>
                  </div>
                </div>

                {/* Content Editor */}
                <textarea
                  {...register("body", {
                    required: "Email content is required",
                  })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-96"
                  placeholder={
                    contentType === "html"
                      ? "<html><body><h1>Hello World</h1><p>Your email content here...</p></body></html>"
                      : contentType === "mime"
                      ? "MIME-Version: 1.0\nContent-Type: multipart/alternative;\n\n--boundary\nContent-Type: text/plain; charset=UTF-8\n\nPlain text version...\n\n--boundary\nContent-Type: text/html; charset=UTF-8\n\n<html>HTML version...</html>\n\n--boundary--"
                      : "Enter your plain text email content here..."
                  }
                />
                {errors.body && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.body.message}
                  </p>
                )}

                {/* MIME Message Section */}
                {contentType === "mime" && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      MIME Message
                    </label>
                    <textarea
                      {...register("mimeMessage")}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-48"
                      placeholder="Full MIME message with headers..."
                    />
                  </div>
                )}

                {/* Search & Replace Button */}
                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors border border-gray-300"
                  >
                    <FiSearch className="w-4 h-4" />
                    Search & Replace
                  </button>
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium mb-2"
                >
                  <FiSettings />
                  {showAdvanced
                    ? "Hide Advanced Settings"
                    : "Show Advanced Settings"}
                </button>

                {showAdvanced && (
                  <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Character Encoding
                      </label>
                      <select
                        {...register("encoding")}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      >
                        <option value="UTF-8">UTF-8 [Bait]</option>
                        <option value="US-ASCII">US-ASCII</option>
                        <option value="ISO-8859-1">ISO-8859-1</option>
                        <option value="WINDOWS-1256">
                          WINDOWS-1256 (Arabic)
                        </option>
                        <option value="SHIFT_JIS">SHIFT_JIS (Japanese)</option>
                        <option value="EUC-KR">EUC-KR (Korean)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Transfer Encoding
                      </label>
                      <select
                        {...register("transferEncoding")}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      >
                        <option value="8bit">8bit</option>
                        <option value="7bit">7bit</option>
                        <option value="binary">binary</option>
                        <option value="quoted-printable">
                          quoted-printable
                        </option>
                        <option value="base64">base64</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Custom Headers (JSON)
                      </label>
                      <textarea
                        {...register("customHeaders")}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20"
                        placeholder='{"X-Custom-Header": "value", "X-Priority": "1"}'
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Reply-To */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reply-To Email
                </label>
                <Input
                  {...register("replyTo", {
                    pattern: {
                      value: /^\S+@\S+$/,
                      message: "Invalid email address",
                    },
                  })}
                  error={errors.replyTo}
                  placeholder="Optional"
                  className="border-gray-300 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Right Column - Email Content & Advanced Settings */}
            <div className="lg:col-span-1 space-y-6">
              {/* Send Configuration */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Send Configuration
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Schedule Send (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      {...register("scheduleDate")}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Throttling (Emails/Hour)
                    </label>
                    <input
                      type="number"
                      min="1"
                      {...register("throttle", {
                        min: { value: 1, message: "Minimum 1" },
                      })}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      defaultValue="100"
                    />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <button
                  type="button"
                  onClick={() => setShowSettings(!showSettings)}
                  className="flex items-center justify-between w-full p-3 bg-gray-50 hover:bg-gray-100 text-gray-800 rounded border border-gray-300 transition-colors"
                >
                  <span className="font-medium">Settings</span>
                  <span
                    className={`transform transition-transform ${
                      showSettings ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {showSettings && (
                  <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Data File
                        </label>
                        <input
                          type="text"
                          {...register("dataFile")}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-gray-700 text-sm"
                          placeholder="Data file"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Total Send
                        </label>
                        <input
                          type="number"
                          {...register("totalSend")}
                          min="0"
                          className="w-full border border-gray-300 rounded px-2 py-1 text-gray-700 text-sm"
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Limit_to_Send
                        </label>
                        <input
                          type="number"
                          {...register("limitToSend")}
                          min="0"
                          className="w-full border border-gray-300 rounded px-2 py-1 text-gray-700 text-sm"
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Sleep Time
                        </label>
                        <input
                          type="number"
                          {...register("sleepTime")}
                          min="0"
                          className="w-full border border-gray-300 rounded px-2 py-1 text-gray-700 text-sm"
                          placeholder="Sec"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Offer ID
                        </label>
                        <input
                          type="text"
                          {...register("offerId")}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-gray-700 text-sm"
                          placeholder="Offer ID"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Template Name
                        </label>
                        <input
                          type="text"
                          {...register("templateName")}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-gray-700 text-sm"
                          placeholder="Template name"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Domain
                        </label>
                        <input
                          type="text"
                          {...register("domain")}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-gray-700 text-sm"
                          placeholder="Domain"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Wait Time
                        </label>
                        <input
                          type="number"
                          {...register("waitTime")}
                          min="0"
                          className="w-full border border-gray-300 rounded px-2 py-1 text-gray-700 text-sm"
                          placeholder="Sec"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Message ID
                        </label>
                        <input
                          type="text"
                          {...register("messageId")}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-gray-700 text-sm"
                          placeholder="Message ID"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Reply to
                        </label>
                        <input
                          type="text"
                          {...register("replyToSetting")}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-gray-700 text-sm"
                          placeholder="Reply to"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          XMAILER
                        </label>
                        <input
                          type="text"
                          {...register("xmailer")}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-gray-700 text-sm"
                          placeholder="XMAILER"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Reply to
                        </label>
                        <div className="flex gap-3 mt-2">
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input
                              type="radio"
                              {...register("replyToEnabled")}
                              value="yes"
                              className="accent-blue-600 w-4 h-4"
                            />
                            <span className="text-xs text-gray-700">YES</span>
                          </label>
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input
                              type="radio"
                              {...register("replyToEnabled")}
                              value="no"
                              className="accent-blue-600 w-4 h-4"
                            />
                            <span className="text-xs text-gray-700">NO</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* Space Sending Dropdown */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <button
                  type="button"
                  onClick={() => setShowSpaceSending(!showSpaceSending)}
                  className="flex items-center justify-between w-full p-3 bg-gray-50 hover:bg-gray-100 text-gray-800 rounded border border-gray-300 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Space Sending</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        {...register("spaceSendingEnabled")}
                        className="accent-blue-600 w-4 h-4"
                      />
                      <span className="text-xs text-gray-700">Space S</span>
                    </div>
                  </div>
                  <span
                    className={`transform transition-transform ${
                      showSpaceSending ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {showSpaceSending && (
                  <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Limit_to_Send
                        </label>
                        <input
                          type="number"
                          {...register("spaceLimitToSend")}
                          min="0"
                          className="w-full border border-gray-300 rounded px-2 py-1 text-gray-700 text-sm"
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Sleep Time
                        </label>
                        <input
                          type="number"
                          {...register("spaceSleepTime")}
                          min="0"
                          className="w-full border border-gray-300 rounded px-2 py-1 text-gray-700 text-sm"
                          placeholder="Sec"
                        />
                      </div>

                      <div className="flex items-end">
                        <div className="flex gap-2 w-full">
                          <button
                            type="button"
                            className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors text-xs"
                          >
                            Start
                          </button>
                          <button
                            type="button"
                            className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors text-xs"
                          >
                            Stop
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Offer ID
                        </label>
                        <input
                          type="text"
                          {...register("spaceOfferId")}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-gray-700 text-sm"
                          placeholder="Offer ID"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Template Name
                        </label>
                        <input
                          type="text"
                          {...register("spaceTemplateName")}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-gray-700 text-sm"
                          placeholder="Template"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Domain
                        </label>
                        <input
                          type="text"
                          {...register("spaceDomain")}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-gray-700 text-sm"
                          placeholder="Domain"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Wait Time
                        </label>
                        <input
                          type="number"
                          {...register("spaceWaitTime")}
                          min="0"
                          className="w-full border border-gray-300 rounded px-2 py-1 text-gray-700 text-sm"
                          placeholder="Sec"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Message ID
                        </label>
                        <input
                          type="text"
                          {...register("spaceMessageId")}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-gray-700 text-sm"
                          placeholder="Message ID"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Reply to
                        </label>
                        <input
                          type="text"
                          {...register("spaceReplyTo")}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-gray-700 text-sm"
                          placeholder="Reply to"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          XMAILER
                        </label>
                        <input
                          type="text"
                          {...register("spaceXmailer")}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-gray-700 text-sm"
                          placeholder="XMAILER"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          XMAILER
                        </label>
                        <input
                          type="text"
                          {...register("spaceXmailer2")}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-gray-700 text-sm"
                          placeholder="XMAILER"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          {...register("spaceSending")}
                          value="yes"
                          className="accent-blue-600 w-4 h-4"
                        />
                        <span className="text-sm text-gray-700">YES</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          {...register("spaceSending")}
                          value="no"
                          className="accent-blue-600 w-4 h-4"
                        />
                        <span className="text-sm text-gray-700">NO</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Test Send Option */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <h4 className="text-gray-800 font-medium mb-2">Test Send</h4>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="test@example.com"
                    className="flex-grow border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                  >
                    Send Test
                  </button>
                </div>
              </div>
              <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Campaign Summary
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-gray-600 text-sm block">
                      Campaign Name
                    </span>
                    <span className="text-gray-800 font-medium">
                      {values.name || "Not set"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm block">
                      Valid Recipients
                    </span>
                    <span className="text-green-600 font-bold">
                      {values.recipientStats?.valid || 0}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm block">From</span>
                    <span className="text-gray-800 font-medium">
                      {values.senderName || "Not set"} &lt;
                      {values.fromEmail || "Not set"}&gt;
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm block">Subject</span>
                    <span className="text-gray-800 font-medium">
                      {values.subject || "Not set"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm block">
                      Email Format
                    </span>
                    <span className="text-gray-800 font-medium uppercase">
                      {values.contentType || "plain"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm block">
                      Encoding
                    </span>
                    <span className="text-gray-800 font-medium font-mono">
                      {values.encoding || "UTF-8"}
                    </span>
                  </div>
                </div>

                {/* Ready to Launch */}
                <div className="mt-6 p-4 bg-blue-50 rounded border border-blue-200">
                  <div className="flex items-start gap-3">
                    <FiSend className="text-blue-600 text-xl mt-0.5" />
                    <div>
                      <h4 className="text-blue-800 font-medium">
                        Ready to Launch?
                      </h4>
                      <p className="text-blue-600 text-sm mt-1">
                        Review all settings above. Once you click "Launch
                        Campaign", the process will start immediately or at the
                        scheduled time.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm flex items-center justify-center">
                <Button
                  variant="primary"
                  type="submit"
                  isLoading={isLoading}
                  className="bg-green-600 hover:bg-green-700 px-8 py-3 text-white rounded-lg shadow-md hover:shadow-lg transition-all w-full justify-center"
                >
                  <FiSend className="mr-2" />
                  Launch Campaign
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Row - Campaign Summary and Launch Button */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Campaign Summary */}

            {/* Launch Button */}
          </div>
        </form>
      </div>

      {/* Rich Text Editor Modal */}
      {showEditor && (
        <RichTextEditor
          value={body}
          onChange={(content) => {
            setValue("body", content, { shouldValidate: true });
            // Also update the content type to HTML when using editor
            if (contentType !== "html") {
              setValue("contentType", "html", { shouldValidate: true });
            }
          }}
          onClose={() => setShowEditor(false)}
        />
      )}

      {/* Preview Modal */}
      <PreviewModal
        isOpen={previewModal.isOpen}
        onClose={() => setPreviewModal({ ...previewModal, isOpen: false })}
        content={previewModal.content}
        contentType={previewModal.contentType}
      />
    </FormProvider>
  );
};

export default CampaignForm;
