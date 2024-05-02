from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from app.core.db import Base


class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)


class Sample(Base):
    __tablename__ = "sample_files"

    id = Column(Integer, primary_key=True)
    title = Column(String, index=True)
    file_path = Column(String)


class Experiment(Base):
    __tablename__ = "experiment"

    id = Column(Integer, primary_key=True)
    name = Column(String, index=True)
    description = Column(String, index=True)
    end_text = Column(String, index=True)

    tests = relationship("Test", back_populates="experiment")


class Test(Base):
    __tablename__ = "test"

    id = Column(Integer, primary_key=True)
    number = Column(Integer)
    test_setup = Column(JSONB, index=True)
    experiment_id = Column(Integer, ForeignKey("experiment.id"))

    experiment = relationship("Experiment", back_populates="tests")
    experiment_test_results = relationship("ExperimentTestResult", back_populates="test")


class ExperimentTestResult(Base):
    __tablename__ = "experiment_test_result"

    id = Column(Integer, primary_key=True)
    test_result = Column(JSONB, index=True)
    test_id = Column(Integer, ForeignKey("test.id"))

    test = relationship("Test", back_populates="experiment_test_results")
