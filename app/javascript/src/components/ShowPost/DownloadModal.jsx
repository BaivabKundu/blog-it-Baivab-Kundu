import React, { useEffect, useState } from "react";

import { Button, Modal } from "@bigbinary/neetoui";
import FileSaver from "file-saver";

import postsApi from "apis/posts";
import createConsumer from "channels/consumer";
import { subscribeToReportDownloadChannel } from "channels/reportDownloadChannel";
import ProgressBar from "components/commons/ProgressBar";

const DownloadModal = ({ showModal, setShowModal, slug }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const consumer = createConsumer();

  const generatePdf = async () => {
    try {
      await postsApi.generatePdf(slug);
    } catch (error) {
      logger.error(error);
    }
  };

  const downloadPdf = async () => {
    setIsLoading(true);
    try {
      const { data } = await postsApi.downloadPdf(slug);
      FileSaver.saveAs(data, "Blog-IT_post_report.pdf");
    } catch (error) {
      logger.error(error);
    } finally {
      setIsLoading(false);
      setShowModal(false);
    }
  };

  useEffect(() => {
    subscribeToReportDownloadChannel({
      consumer,
      setMessage,
      setProgress,
      generatePdf,
    });

    return () => {
      consumer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (progress === 100) {
      setIsLoading(false);
      setMessage("Report is ready to be downloaded");
    }
  }, [progress]);

  return (
    <div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="m-4">
          <div className="mb-4 w-full overflow-hidden rounded-lg border border-gray-200 bg-white text-gray-800 sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-2xl">
            <div className="space-y-2 p-6">
              <p className="text-xl font-semibold">{message}</p>
              <ProgressBar progress={progress} />
            </div>
          </div>
          <Button
            label="Download PDF"
            loading={isLoading}
            onClick={downloadPdf}
          />
        </div>
      </Modal>
    </div>
  );
};

export default DownloadModal;
